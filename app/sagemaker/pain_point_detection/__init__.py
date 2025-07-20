"""
VPFlow Pain Point Detection Module

This module provides comprehensive pain point analysis for workflow diagrams:

- PainPointDetector: Core analysis engine that identifies bottlenecks, errors, and inefficiencies
- PainPointService: High-level service layer that integrates with database and provides business logic
- Analysis capabilities include:
  - SLA violation detection
  - Error rate and rework analysis  
  - Dependency complexity assessment
  - Approval bottleneck identification
  - Risk level evaluation
  - Automated recommendations generation

Usage:
    from app.sagemaker.pain_point_detection import PainPointDetector, PainPointService
    
    # Direct analysis
    detector = PainPointDetector(workflow_data)
    pain_points = detector.detect_pain_points('medium')
    
    # Service layer with database integration
    result = PainPointService.analyze_diagram_pain_points(diagram_id)
"""

from .pain_point import PainPointDetector
from .service import PainPointService

__all__ = [
    'PainPointDetector',
    'PainPointService'
]

__version__ = '2.0.0'
