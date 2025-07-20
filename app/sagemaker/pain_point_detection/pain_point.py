import logging
from typing import List, Dict, Any, Optional, Tuple
import json
from datetime import datetime

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class PainPointDetector:
    """
    PainPointDetector nâng cao để phân tích workflow VPFlow và xác định pain points dựa trên:
    - Thời gian xử lý và SLA vi phạm
    - Tỉ lệ lỗi và rework patterns
    - Số lượng dependencies và handoffs phức tạp
    - Risk levels và cost estimates
    - Bottleneck analysis
    - Compliance và approval gate issues
    """

    def __init__(self, workflow_data: Dict[str, Any]):
        """
        Khởi tạo với dữ liệu workflow theo schema VPFlow chuẩn.
        Args:
            workflow_data (Dict): VPFlow workflow JSON với structure:
                - process_name: Tên quy trình
                - swimlanes: Danh sách vai trò và steps
                - metrics: Thông tin bottleneck và metrics tổng quan
        """
        self.workflow_data = workflow_data
        self.all_steps = self._extract_all_steps()
        self.pain_point_categories = {
            'bottleneck': 'Điểm nghẽn trong quy trình',
            'high_error_rate': 'Tỉ lệ lỗi cao',
            'excessive_rework': 'Phải làm lại nhiều lần',  
            'long_duration': 'Thời gian xử lý quá lâu',
            'complex_dependencies': 'Phụ thuộc phức tạp',
            'frequent_handoffs': 'Chuyển giao thường xuyên',
            'high_risk': 'Rủi ro cao',
            'sla_violation': 'Vi phạm SLA',
            'approval_bottleneck': 'Nghẽn tại approval gate'
        }
    
    def _extract_all_steps(self) -> List[Dict[str, Any]]:
        """
        Trích xuất tất cả steps từ tất cả swimlanes
        """
        all_steps = []
        for swimlane in self.workflow_data.get('swimlanes', []):
            for step in swimlane.get('steps', []):
                step['role'] = swimlane.get('role', 'Unknown')
                step['department'] = swimlane.get('department', '')
                all_steps.append(step)
        return all_steps

    
    def calculate_complexity_score(self, step: Dict[str, Any]) -> float:
        """
        Tính điểm độ phức tạp của một step
        """
        duration = step.get('duration', 0)
        dependencies = len(step.get('dependencies', []))
        transitions = len(step.get('actor_transitions', []))
        error_rate = step.get('error_rate', 0)
        rework_count = step.get('rework_count', 0)
        risk_level = step.get('risk_level', 0)
        
        # Base complexity từ duration và dependencies
        base_score = duration * (1 + dependencies * 0.5)
        
        # Penalty cho transitions
        transition_penalty = transitions * 2
        
        # Penalty cho error và rework
        error_penalty = error_rate * 50  # error_rate thường là decimal
        rework_penalty = rework_count * 10
        
        # Risk penalty
        risk_penalty = risk_level * 5 if risk_level else 0
        
        total_score = base_score + transition_penalty + error_penalty + rework_penalty + risk_penalty
        return round(total_score, 2)
    
    def check_sla_violation(self, step: Dict[str, Any]) -> bool:
        """
        Kiểm tra xem step có vi phạm SLA không
        """
        sla = step.get('sla', '')
        duration = step.get('duration', 0)
        
        if not sla or not duration:
            return False
        
        # Parse SLA string (e.g., "2 ngày", "1 ngày", "5 phút")
        sla_lower = sla.lower()
        try:
            if 'ngày' in sla_lower:
                sla_days = float(sla_lower.split()[0])
                return duration > sla_days
            elif 'giờ' in sla_lower:
                sla_hours = float(sla_lower.split()[0])
                return duration > (sla_hours / 24)  # Convert to days
            elif 'phút' in sla_lower:
                sla_minutes = float(sla_lower.split()[0])
                return duration > (sla_minutes / (24 * 60))  # Convert to days
        except (ValueError, IndexError):
            pass
        
        return False
    
    def is_approval_bottleneck(self, step: Dict[str, Any]) -> bool:
        """
        Xác định xem step có phải là approval bottleneck không
        """
        approval_required = step.get('approval_required', False)
        duration = step.get('duration', 0)
        
        # Nếu cần approval và duration cao, có thể là bottleneck
        if approval_required and duration > 1:  # > 1 day
            return True
            
        # Check trong metrics xem có phải bottleneck step không
        bottleneck_steps = self.workflow_data.get('metrics', {}).get('bottleneck_steps', [])
        if isinstance(bottleneck_steps, list):
            return step.get('id', '') in bottleneck_steps
        elif isinstance(bottleneck_steps, str):
            return step.get('id', '') == bottleneck_steps
            
        return False

    def analyze_step_pain_points(self, step: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Phân tích chi tiết pain points cho một step cụ thể
        """
        pain_points = []
        step_id = step.get('id', 'unknown')
        step_name = step.get('name', 'Unknown Step')
        
        # 1. High Error Rate
        error_rate = step.get('error_rate', 0)
        if error_rate > 0.05:  # > 5%
            pain_points.append({
                'step_id': step_id,
                'step_name': step_name,
                'category': 'high_error_rate',
                'severity': 'high' if error_rate > 0.1 else 'medium',
                'score': error_rate * 100,
                'description': f"Tỉ lệ lỗi cao ({error_rate:.1%}) có thể gây chậm trễ và tăng chi phí",
                'recommendation': "Cần rà soát quy trình và đào tạo thêm để giảm lỗi",
                'visual_cue': 'red_border'
            })
        
        # 2. Excessive Rework
        rework_count = step.get('rework_count', 0)
        if rework_count > 1:
            pain_points.append({
                'step_id': step_id,
                'step_name': step_name,
                'category': 'excessive_rework', 
                'severity': 'high' if rework_count > 2 else 'medium',
                'score': rework_count * 10,
                'description': f"Phải làm lại {rework_count} lần, gây lãng phí thời gian và tài nguyên",
                'recommendation': "Cần cải thiện quality control và training",
                'visual_cue': 'orange_glow'
            })
        
        # 3. Long Duration / SLA Violation
        if self.check_sla_violation(step):
            pain_points.append({
                'step_id': step_id,
                'step_name': step_name,
                'category': 'sla_violation',
                'severity': 'high',
                'score': step.get('duration', 0) * 10,
                'description': f"Vi phạm SLA ({step.get('sla', 'N/A')}), thời gian thực tế: {step.get('duration', 0)} ngày",
                'recommendation': "Cần tối ưu quy trình hoặc điều chỉnh SLA",
                'visual_cue': 'red_glow'
            })
        elif step.get('duration', 0) > 3:  # > 3 days
            pain_points.append({
                'step_id': step_id,
                'step_name': step_name,
                'category': 'long_duration',
                'severity': 'medium',
                'score': step.get('duration', 0) * 5,
                'description': f"Thời gian xử lý lâu ({step.get('duration')} ngày)",
                'recommendation': "Xem xét tự động hóa hoặc song song hóa một số công việc",
                'visual_cue': 'yellow_glow'
            })
        
        # 4. Complex Dependencies
        dependencies = step.get('dependencies', [])
        if len(dependencies) > 3:
            pain_points.append({
                'step_id': step_id,
                'step_name': step_name,
                'category': 'complex_dependencies',
                'severity': 'medium',
                'score': len(dependencies) * 3,
                'description': f"Phụ thuộc vào {len(dependencies)} bước khác, tạo độ phức tạp cao",
                'recommendation': "Xem xét giảm dependencies hoặc tạo parallel flows",
                'visual_cue': 'purple_border'
            })
        
        # 5. Frequent Handoffs
        transitions = step.get('actor_transitions', [])
        if len(transitions) > 2:
            pain_points.append({
                'step_id': step_id,
                'step_name': step_name,
                'category': 'frequent_handoffs',
                'severity': 'medium',
                'score': len(transitions) * 4,
                'description': f"Chuyển giao qua {len(transitions)} actor khác nhau, dễ gây nhầm lẫn",
                'recommendation': "Giảm số lần handoff hoặc cải thiện communication",
                'visual_cue': 'blue_border'
            })
        
        # 6. High Risk
        risk_level = step.get('risk_level', 0)
        if risk_level and risk_level >= 4:
            pain_points.append({
                'step_id': step_id,
                'step_name': step_name,
                'category': 'high_risk',
                'severity': 'high',
                'score': risk_level * 8,
                'description': f"Mức độ rủi ro cao (Level {risk_level}), cần kiểm soát chặt chẽ",
                'recommendation': "Tăng cường monitoring và backup plans",
                'visual_cue': 'red_thick_border'
            })
        
        # 7. Approval Bottleneck
        if self.is_approval_bottleneck(step):
            pain_points.append({
                'step_id': step_id,
                'step_name': step_name,
                'category': 'approval_bottleneck',
                'severity': 'high',
                'score': 25,
                'description': "Là điểm nghẽn approval, gây chậm trễ toàn quy trình",
                'recommendation': "Xem xét delegation authority hoặc parallel approval",
                'visual_cue': 'red_double_border'
            })
        
        return pain_points

    def detect_pain_points(self, severity_threshold: str = 'medium') -> List[Dict[str, Any]]:
        """
        Phân tích workflow để phát hiện các pain points tiềm năng.
        
        Args:
            severity_threshold: Mức độ nghiêm trọng tối thiểu ('low', 'medium', 'high')
            
        Returns:
            List[Dict]: Danh sách các pain points được phát hiện với đầy đủ thông tin
        """
        all_pain_points = []
        severity_levels = {'low': 1, 'medium': 2, 'high': 3}
        min_severity = severity_levels.get(severity_threshold, 2)
        
        # Phân tích từng step
        for step in self.all_steps:
            step_pain_points = self.analyze_step_pain_points(step)
            for pain_point in step_pain_points:
                pain_point_severity = severity_levels.get(pain_point['severity'], 1)
                if pain_point_severity >= min_severity:
                    all_pain_points.append(pain_point)
        
        # Sắp xếp theo severity và score
        all_pain_points.sort(key=lambda x: (severity_levels.get(x['severity'], 1), x['score']), reverse=True)
        
        logger.info(f"Phát hiện {len(all_pain_points)} pain points với severity >= {severity_threshold}")
        return all_pain_points
    
    def get_process_overview(self) -> Dict[str, Any]:
        """
        Lấy tổng quan về quy trình và pain points
        """
        pain_points = self.detect_pain_points('low')  # Get all pain points
        
        overview = {
            'process_name': self.workflow_data.get('process_name', 'Unknown Process'),
            'version': self.workflow_data.get('version', 'N/A'),
            'total_steps': len(self.all_steps),
            'total_pain_points': len(pain_points),
            'pain_point_distribution': {
                'high': len([p for p in pain_points if p['severity'] == 'high']),
                'medium': len([p for p in pain_points if p['severity'] == 'medium']),
                'low': len([p for p in pain_points if p['severity'] == 'low'])
            },
            'category_breakdown': {}
        }
        
        # Tính breakdown theo category
        for category in self.pain_point_categories:
            category_points = [p for p in pain_points if p['category'] == category]
            if category_points:
                overview['category_breakdown'][category] = {
                    'count': len(category_points),
                    'description': self.pain_point_categories[category],
                    'avg_score': round(sum(p['score'] for p in category_points) / len(category_points), 2),
                    'affected_steps': list(set(p['step_id'] for p in category_points))
                }
        
        return overview
    
    def get_recommendations(self) -> List[Dict[str, Any]]:
        """
        Đề xuất cải tiến dựa trên pain points phát hiện được
        """
        pain_points = self.detect_pain_points('medium')
        recommendations = []
        
        # Group by category for better recommendations
        category_groups = {}
        for pain_point in pain_points:
            category = pain_point['category']
            if category not in category_groups:
                category_groups[category] = []
            category_groups[category].append(pain_point)
        
        priority = 1
        for category, points in category_groups.items():
            if category == 'high_error_rate':
                recommendations.append({
                    'priority': priority,
                    'category': category,
                    'title': 'Giảm tỉ lệ lỗi quy trình',
                    'description': 'Cải thiện quality control và đào tạo nhân viên',
                    'affected_steps': len(points),
                    'impact': 'high',
                    'effort': 'medium',
                    'timeline': '2-3 tháng'
                })
            elif category == 'approval_bottleneck':
                recommendations.append({
                    'priority': priority,
                    'category': category,
                    'title': 'Tối ưu approval process',
                    'description': 'Xem xét delegation authority và parallel approval',
                    'affected_steps': len(points),
                    'impact': 'high',
                    'effort': 'high',
                    'timeline': '1-2 tháng'
                })
            elif category == 'sla_violation':
                recommendations.append({
                    'priority': priority,
                    'category': category,
                    'title': 'Đạt SLA requirements',
                    'description': 'Tối ưu quy trình hoặc điều chỉnh SLA phù hợp',
                    'affected_steps': len(points),
                    'impact': 'high',
                    'effort': 'medium',
                    'timeline': '1-2 tháng'
                })
            elif category == 'long_duration':
                recommendations.append({
                    'priority': priority + 1,
                    'category': category,
                    'title': 'Giảm thời gian xử lý',
                    'description': 'Tự động hóa hoặc song song hóa các công việc',
                    'affected_steps': len(points),
                    'impact': 'medium',
                    'effort': 'high',
                    'timeline': '3-6 tháng'
                })
            priority += 1
        
        return sorted(recommendations, key=lambda x: x['priority'])
    
    def export_analysis_report(self) -> Dict[str, Any]:
        """
        Xuất báo cáo phân tích đầy đủ
        """
        return {
            'metadata': {
                'analysis_date': datetime.now().isoformat(),
                'analyzer_version': '2.0',
                'workflow_version': self.workflow_data.get('version', 'N/A')
            },
            'process_overview': self.get_process_overview(),
            'pain_points': self.detect_pain_points('low'),  # All pain points
            'recommendations': self.get_recommendations(),
            'metrics': {
                'complexity_scores': {
                    step['id']: self.calculate_complexity_score(step) 
                    for step in self.all_steps
                },
                'high_risk_steps': [
                    step['id'] for step in self.all_steps 
                    if step.get('risk_level', 0) >= 4
                ],
                'bottleneck_analysis': self.workflow_data.get('metrics', {})
            }
        }

# Ví dụ sử dụng với VPFlow workflow structure
if __name__ == "__main__":
    # Sample VPFlow workflow data
    sample_vpflow_workflow = {
        "process_name": "Xử lý khoản vay doanh nghiệp VPBank",
        "version": "VPB-LOAN-2024-12",
        "created_date": "2024-12-01",
        "swimlanes": [
            {
                "role": "Customer",
                "department": "External",
                "steps": [
                    {
                        "id": "step_1",
                        "name": "Nộp hồ sơ vay",
                        "description": "Khách hàng nộp hồ sơ vay với đầy đủ giấy tờ theo quy định",
                        "duration": 1,
                        "dependencies": [],
                        "actor_transitions": [],
                        "error_rate": 0.05,
                        "rework_count": 1,
                        "cost_estimate": 0,
                        "risk_level": 1,
                        "sla": "1 ngày",
                        "approval_required": False
                    }
                ]
            },
            {
                "role": "Credit Officer", 
                "department": "Risk Management",
                "steps": [
                    {
                        "id": "step_2",
                        "name": "Thẩm định sơ bộ",
                        "description": "Kiểm tra điều kiện cơ bản, lịch sử tín dụng",
                        "duration": 2,
                        "dependencies": ["step_1"],
                        "actor_transitions": ["Nhận hồ sơ từ Customer"],
                        "error_rate": 0.03,
                        "rework_count": 0,
                        "cost_estimate": 500000,
                        "risk_level": 3,
                        "sla": "2 ngày",
                        "approval_required": False
                    },
                    {
                        "id": "step_3",
                        "name": "Thẩm định chi tiết",
                        "description": "Phân tích tài chính, đánh giá khả năng trả nợ chi tiết",
                        "duration": 3,
                        "dependencies": ["step_2"],
                        "actor_transitions": [],
                        "error_rate": 0.02,
                        "rework_count": 0,
                        "cost_estimate": 1000000,
                        "risk_level": 4,
                        "sla": "3 ngày",
                        "penalty": "Phạt 0.1% giá trị khoản vay nếu quá hạn",
                        "approval_required": True
                    }
                ]
            }
        ],
        "metrics": {
            "total_duration": 6,
            "average_error_rate": 0.033,
            "bottleneck_steps": ["step_2", "step_3"],
            "high_risk_steps": ["step_3"]
        }
    }

    # Khởi tạo detector
    detector = PainPointDetector(sample_vpflow_workflow)
    
    # Phát hiện pain points
    print("=== PAIN POINTS ANALYSIS ===")
    pain_points = detector.detect_pain_points('medium')
    for point in pain_points:
        print(f"Step: {point['step_name']} ({point['step_id']})")
        print(f"Category: {point['category']} | Severity: {point['severity']} | Score: {point['score']}")
        print(f"Description: {point['description']}")
        print(f"Recommendation: {point['recommendation']}")
        print(f"Visual Cue: {point['visual_cue']}")
        print("-" * 50)
    
    # Tổng quan quy trình
    print("\n=== PROCESS OVERVIEW ===")
    overview = detector.get_process_overview()
    print(f"Process: {overview['process_name']} v{overview['version']}")
    print(f"Total Steps: {overview['total_steps']}")
    print(f"Total Pain Points: {overview['total_pain_points']}")
    print(f"Distribution - High: {overview['pain_point_distribution']['high']}, "
          f"Medium: {overview['pain_point_distribution']['medium']}, "
          f"Low: {overview['pain_point_distribution']['low']}")
    
    # Khuyến nghị
    print("\n=== RECOMMENDATIONS ===")
    recommendations = detector.get_recommendations()
    for rec in recommendations:
        print(f"Priority {rec['priority']}: {rec['title']}")
        print(f"Description: {rec['description']}")
        print(f"Impact: {rec['impact']} | Effort: {rec['effort']} | Timeline: {rec['timeline']}")
        print(f"Affected Steps: {rec['affected_steps']}")
        print("-" * 30)
    
    # Xuất báo cáo đầy đủ
    print("\n=== EXPORTING FULL REPORT ===")
    full_report = detector.export_analysis_report()
    print(f"Report generated at: {full_report['metadata']['analysis_date']}")
    print(f"Total complexity scores calculated: {len(full_report['metrics']['complexity_scores'])}")
    
    # Save to JSON file for integration
    with open('pain_point_analysis_report.json', 'w', encoding='utf-8') as f:
        json.dump(full_report, f, ensure_ascii=False, indent=2)
    print("Full report saved to pain_point_analysis_report.json")