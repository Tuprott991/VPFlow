import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class PainPointDetector:
    """
    PainPointDetector tự động quét workflow VPFlow và xác định các điểm nghẽn (pain points) dựa trên các tiêu chí:
    - Thời gian xử lý lớn
    - Nhiều actor/handoff
    - Nhiều phụ thuộc (dependencies)
    - Tỉ lệ lỗi hoặc số lần rework cao
    """

    def __init__(self, workflow_data: List[Dict[str, Any]]):
        """
        Khởi tạo với dữ liệu workflow.
        Args:
            workflow_data (List[Dict]): Danh sách các bước workflow, mỗi bước gồm:
                - name: Tên bước
                - duration: Thời gian xử lý (giờ/ngày)
                - dependencies: Số lượng bước phụ thuộc
                - actor_transitions: Số lần chuyển giao giữa các actor
                - error_rate: Tỉ lệ lỗi (nếu có)
                - rework_count: Số lần phải làm lại (nếu có)
        """
        self.workflow_data = workflow_data

    def score_pain_point(self, step: Dict[str, Any]) -> float:
        """
        Tính điểm pain point cho một bước workflow.
        Công thức: duration × dependencies × actor_transitions (+ error/rework nếu có)
        """
        duration = step.get("duration", 1)
        dependencies = step.get("dependencies", 1)
        actor_transitions = step.get("actor_transitions", 1)
        error_rate = step.get("error_rate", 0)
        rework_count = step.get("rework_count", 0)

        score = duration * dependencies * actor_transitions
        score += error_rate * 10  # tăng trọng số cho lỗi
        score += rework_count * 5 # tăng trọng số cho rework
        return score

    def detect_pain_points(self, threshold: float = 10.0) -> List[Dict[str, Any]]:
        """
        Phân tích workflow để phát hiện các điểm nghẽn tiềm năng.
        Returns:
            List[Dict]: Danh sách các pain points phát hiện được, gồm tên bước, điểm số và giải thích.
        """
        pain_points = []
        for step in self.workflow_data:
            score = self.score_pain_point(step)
            if score >= threshold:
                pain_points.append({
                    "step": step.get("name"),
                    "score": round(score, 2),
                    "detail": (
                        f"Thời gian: {step.get('duration', 1)}, "
                        f"Phụ thuộc: {step.get('dependencies', 1)}, "
                        f"Chuyển giao: {step.get('actor_transitions', 1)}, "
                        f"Lỗi: {step.get('error_rate', 0)}, "
                        f"Rework: {step.get('rework_count', 0)}"
                    ),
                    "visual_cue": "red_glow"  # dùng cho frontend highlight node
                })
        logger.info(f"Phát hiện {len(pain_points)} pain points.")
        return pain_points

# Ví dụ sử dụng
if __name__ == "__main__":
    sample_workflow = [
        {"name": "Khởi tạo hồ sơ", "duration": 1, "dependencies": 1, "actor_transitions": 1, "error_rate": 0.01, "rework_count": 0},
        {"name": "Thẩm định tín dụng", "duration": 3, "dependencies": 2, "actor_transitions": 2, "error_rate": 0.02, "rework_count": 1},
        {"name": "Phê duyệt", "duration": 0.5, "dependencies": 1, "actor_transitions": 3, "error_rate": 0.08, "rework_count": 2},
        {"name": "Giải ngân", "duration": 2, "dependencies": 3, "actor_transitions": 2, "error_rate": 0.03, "rework_count": 0},
    ]

    detector = PainPointDetector(sample_workflow)
    pain_points = detector.detect_pain_points(threshold=10)
    for point in pain_points:
        print(f"Bước: {point['step']}, Điểm: {point['score']}, Chi tiết: {point['detail']}, Hiệu ứng: {point['visual_cue']}")