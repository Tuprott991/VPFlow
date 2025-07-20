"""
VPFlow Pain Point Service

Provides high-level service functions for pain point detection and management,
integrating the PainPointDetector with database operations.
"""

import logging
from typing import List, Dict, Any, Optional, UUID
from uuid import uuid4
from datetime import datetime
import json

from app.sagemaker.pain_point_detection.pain_point import PainPointDetector
from app.database.diagram import (
    get_diagram_by_id, update_pain_points, update_metrics,
    list_diagrams, get_diagrams_with_pain_points
)
from app.database.feedback import (
    create_feedback, get_feedback_by_target, get_pain_point_feedback_summary
)

logger = logging.getLogger(__name__)

class PainPointService:
    """
    Service class for pain point analysis and management
    """
    
    @staticmethod
    def analyze_diagram_pain_points(diagram_id: UUID, user_id: UUID = None) -> Dict[str, Any]:
        """
        Phân tích pain points cho một diagram cụ thể
        
        Args:
            diagram_id: ID của diagram cần phân tích
            user_id: ID của user thực hiện phân tích
            
        Returns:
            Dict chứa kết quả phân tích pain points
        """
        try:
            # Lấy diagram data từ database
            diagram = get_diagram_by_id(diagram_id)
            if not diagram:
                raise ValueError(f"Diagram {diagram_id} không tồn tại")
            
            workflow_data = diagram['workflow_data']
            if isinstance(workflow_data, str):
                workflow_data = json.loads(workflow_data)
            
            # Khởi tạo detector và phân tích
            detector = PainPointDetector(workflow_data)
            pain_points = detector.detect_pain_points('low')  # Lấy tất cả pain points
            overview = detector.get_process_overview()
            recommendations = detector.get_recommendations()
            
            # Cập nhật pain points vào database
            update_pain_points(diagram_id, pain_points)
            
            # Cập nhật metrics
            analysis_metrics = {
                'last_analysis_date': datetime.now().isoformat(),
                'pain_points_count': len(pain_points),
                'high_severity_count': len([p for p in pain_points if p['severity'] == 'high']),
                'recommendations_count': len(recommendations),
                'analyzer_version': '2.0'
            }
            update_metrics(diagram_id, analysis_metrics)
            
            logger.info(f"Phân tích thành công diagram {diagram_id}, phát hiện {len(pain_points)} pain points")
            
            return {
                'diagram_id': str(diagram_id),
                'process_name': workflow_data.get('process_name', 'Unknown'),
                'analysis_date': datetime.now().isoformat(),
                'pain_points': pain_points,
                'overview': overview,
                'recommendations': recommendations,
                'status': 'success'
            }
            
        except Exception as e:
            logger.error(f"Lỗi phân tích pain points cho diagram {diagram_id}: {str(e)}")
            return {
                'diagram_id': str(diagram_id),
                'status': 'error',
                'error': str(e)
            }
    
    @staticmethod
    def batch_analyze_pain_points(user_id: UUID = None, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Phân tích pain points cho nhiều diagrams
        
        Args:
            user_id: ID của user (nếu chỉ phân tích diagrams của user này)
            limit: Số lượng diagrams tối đa để phân tích
            
        Returns:
            List các kết quả phân tích
        """
        try:
            # Lấy danh sách diagrams
            diagrams = list_diagrams(user_id=user_id, limit=limit)
            results = []
            
            for diagram in diagrams:
                diagram_id = UUID(diagram['id'])
                result = PainPointService.analyze_diagram_pain_points(diagram_id, user_id)
                results.append(result)
            
            logger.info(f"Phân tích batch hoàn thành cho {len(results)} diagrams")
            return results
            
        except Exception as e:
            logger.error(f"Lỗi batch analyze: {str(e)}")
            return []
    
    @staticmethod
    def get_pain_point_summary() -> Dict[str, Any]:
        """
        Lấy tổng hợp về tất cả pain points trong hệ thống
        
        Returns:
            Dict chứa tổng hợp pain points
        """
        try:
            diagrams_with_pain_points = get_diagrams_with_pain_points()
            
            all_pain_points = []
            process_summaries = []
            
            for diagram in diagrams_with_pain_points:
                pain_points = diagram.get('pain_points', [])
                if isinstance(pain_points, str):
                    pain_points = json.loads(pain_points)
                
                all_pain_points.extend(pain_points)
                
                process_summaries.append({
                    'diagram_id': diagram['id'],
                    'process_name': diagram['process_name'],
                    'version': diagram['version'],
                    'pain_points_count': len(pain_points),
                    'high_severity_count': len([p for p in pain_points if p['severity'] == 'high']),
                    'created_at': diagram['created_at']
                })
            
            # Tính thống kê tổng quan
            category_stats = {}
            severity_stats = {'high': 0, 'medium': 0, 'low': 0}
            
            for pain_point in all_pain_points:
                # Stats by category
                category = pain_point.get('category', 'unknown')
                if category not in category_stats:
                    category_stats[category] = []
                category_stats[category].append(pain_point)
                
                # Stats by severity
                severity = pain_point.get('severity', 'low')
                if severity in severity_stats:
                    severity_stats[severity] += 1
            
            # Top pain point categories
            top_categories = sorted(
                category_stats.items(),
                key=lambda x: len(x[1]),
                reverse=True
            )[:5]
            
            return {
                'total_diagrams_analyzed': len(diagrams_with_pain_points),
                'total_pain_points': len(all_pain_points),
                'severity_distribution': severity_stats,
                'top_categories': [
                    {
                        'category': cat,
                        'count': len(points),
                        'avg_score': round(sum(p['score'] for p in points) / len(points), 2) if points else 0
                    }
                    for cat, points in top_categories
                ],
                'process_summaries': process_summaries,
                'analysis_date': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Lỗi lấy pain point summary: {str(e)}")
            return {}
    
    @staticmethod
    def submit_pain_point_feedback(user_id: UUID, pain_point_id: str, 
                                 rating: int, comment: str = None, 
                                 tags: List[str] = None) -> Dict[str, Any]:
        """
        Submit feedback cho một pain point cụ thể
        
        Args:
            user_id: ID người dùng
            pain_point_id: ID của pain point (step_id)
            rating: Điểm đánh giá (1-5)
            comment: Bình luận
            tags: Các tag phân loại
            
        Returns:
            Dict chứa thông tin feedback đã tạo
        """
        try:
            # Tạo metadata chứa thông tin pain point
            metadata = {
                'pain_point_id': pain_point_id,
                'feedback_source': 'pain_point_analysis'
            }
            
            feedback = create_feedback(
                user_id=user_id,
                feedback_type='pain_point',
                rating=rating,
                comment=comment,
                target_id=UUID(pain_point_id) if pain_point_id else None,
                tags=tags,
                metadata=metadata
            )
            
            logger.info(f"Tạo feedback thành công cho pain point {pain_point_id}")
            return {
                'status': 'success',
                'feedback_id': feedback['id'],
                'message': 'Feedback đã được ghi nhận'
            }
            
        except Exception as e:
            logger.error(f"Lỗi tạo feedback cho pain point {pain_point_id}: {str(e)}")
            return {
                'status': 'error',
                'error': str(e)
            }
    
    @staticmethod
    def get_pain_point_feedback_analysis() -> Dict[str, Any]:
        """
        Phân tích feedback về pain points
        
        Returns:
            Dict chứa phân tích feedback
        """
        try:
            feedback_summary = get_pain_point_feedback_summary()
            
            analysis = {
                'total_pain_points_with_feedback': len(feedback_summary),
                'pain_point_details': [],
                'overall_satisfaction': 0,
                'common_issues': [],
                'analysis_date': datetime.now().isoformat()
            }
            
            total_ratings = []
            issue_keywords = {}
            
            for item in feedback_summary:
                pain_point_detail = {
                    'pain_point_id': item['target_id'],
                    'feedback_count': item['feedback_count'],
                    'average_rating': round(float(item['average_rating']), 2),
                    'comments': item['comments'] or []
                }
                
                analysis['pain_point_details'].append(pain_point_detail)
                total_ratings.append(float(item['average_rating']))
                
                # Phân tích keywords từ comments
                for comment in (item['comments'] or []):
                    if comment and isinstance(comment, str):
                        words = comment.lower().split()
                        for word in words:
                            if len(word) > 3:  # Chỉ lấy từ có ý nghĩa
                                issue_keywords[word] = issue_keywords.get(word, 0) + 1
            
            # Tính overall satisfaction
            if total_ratings:
                analysis['overall_satisfaction'] = round(sum(total_ratings) / len(total_ratings), 2)
            
            # Top common issues
            analysis['common_issues'] = sorted(
                issue_keywords.items(),
                key=lambda x: x[1],
                reverse=True
            )[:10]
            
            return analysis
            
        except Exception as e:
            logger.error(f"Lỗi phân tích feedback: {str(e)}")
            return {}
    
    @staticmethod
    def generate_improvement_report(diagram_id: UUID) -> Dict[str, Any]:
        """
        Tạo báo cáo cải tiến cho một diagram
        
        Args:
            diagram_id: ID của diagram
            
        Returns:
            Dict chứa báo cáo cải tiến
        """
        try:
            # Lấy thông tin diagram và pain points
            analysis_result = PainPointService.analyze_diagram_pain_points(diagram_id)
            
            if analysis_result['status'] != 'success':
                return analysis_result
            
            pain_points = analysis_result['pain_points']
            recommendations = analysis_result['recommendations']
            
            # Lấy feedback cho pain points
            feedback_list = []
            for pain_point in pain_points:
                step_id = pain_point.get('step_id')
                if step_id:
                    try:
                        target_uuid = UUID(step_id)
                        feedbacks = get_feedback_by_target(target_uuid, 'pain_point')
                        feedback_list.extend(feedbacks)
                    except ValueError:
                        # step_id không phải UUID hợp lệ
                        pass
            
            # Tạo improvement report
            report = {
                'diagram_id': str(diagram_id),
                'process_name': analysis_result['process_name'],
                'analysis_date': analysis_result['analysis_date'],
                'executive_summary': {
                    'total_pain_points': len(pain_points),
                    'high_priority_issues': len([p for p in pain_points if p['severity'] == 'high']),
                    'recommendations_count': len(recommendations),
                    'user_feedback_count': len(feedback_list)
                },
                'detailed_findings': pain_points,
                'improvement_recommendations': recommendations,
                'user_feedback_insights': feedback_list,
                'next_steps': [
                    {
                        'action': 'Prioritize high-severity pain points',
                        'timeline': 'Immediate',
                        'owner': 'Process Owner'
                    },
                    {
                        'action': 'Implement top recommendations',
                        'timeline': '1-2 months',
                        'owner': 'Development Team'
                    },
                    {
                        'action': 'Monitor improvements',
                        'timeline': 'Ongoing',
                        'owner': 'Quality Team'
                    }
                ],
                'report_generated_at': datetime.now().isoformat()
            }
            
            logger.info(f"Tạo improvement report thành công cho diagram {diagram_id}")
            return report
            
        except Exception as e:
            logger.error(f"Lỗi tạo improvement report: {str(e)}")
            return {
                'status': 'error',
                'error': str(e)
            }
