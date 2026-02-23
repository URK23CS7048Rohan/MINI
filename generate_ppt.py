import collections
import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.shapes import MSO_CONNECTOR

def create_medivision_presentation():
    prs = Presentation()
    
    # Custom slide size (16:9 widescreen)
    prs.slide_width = Inches(13.33)
    prs.slide_height = Inches(7.5)
    
    # Colors (Neo-Brutalism Palette)
    CHARCOAL = RGBColor(28, 28, 28)
    CREAM = RGBColor(245, 245, 245)
    SAGE = RGBColor(163, 196, 175)
    
    # --- HELPER FUNCTIONS ---
    def set_dark_background(slide):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = CHARCOAL

    def add_brutalist_title(slide, text, top_inches=0.8):
        shape = slide.shapes.add_textbox(Inches(0.8), Inches(top_inches), Inches(11), Inches(1.5))
        tf = shape.text_frame
        p = tf.add_paragraph()
        p.text = text
        p.font.name = 'Arial Black'
        p.font.size = Pt(54)  # slightly smaller to fit longer titles
        p.font.color.rgb = CREAM
        p.font.bold = True
        return shape

    def add_brutalist_subtitle(slide, text, top_inches):
        shape = slide.shapes.add_textbox(Inches(0.8), Inches(top_inches), Inches(11), Inches(1))
        tf = shape.text_frame
        p = tf.add_paragraph()
        p.text = text
        p.font.name = 'Arial'
        p.font.size = Pt(28)
        p.font.color.rgb = SAGE
        p.font.bold = True
        return shape
        
    def add_body_text(slide, text, top_inches, left_inches=0.8, width_inches=11):
        shape = slide.shapes.add_textbox(Inches(left_inches), Inches(top_inches), Inches(width_inches), Inches(4))
        tf = shape.text_frame
        tf.word_wrap = True
        p = tf.add_paragraph()
        p.text = text
        p.font.name = 'Consolas'
        p.font.size = Pt(18)
        p.font.color.rgb = CREAM
        return shape
        
    def add_stat_box(slide, value, label, left_inches, top_inches, width=2.5, height=1.5):
        shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE,
            Inches(left_inches), Inches(top_inches), Inches(width), Inches(height)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = CHARCOAL
        shape.line.color.rgb = CREAM
        shape.line.width = Pt(3)
        
        tf = shape.text_frame
        tf.word_wrap = True
        
        p1 = tf.add_paragraph()
        p1.text = value
        p1.font.name = 'Arial Black'
        p1.font.size = Pt(40)
        p1.font.color.rgb = SAGE
        p1.alignment = PP_ALIGN.CENTER
        
        p2 = tf.add_paragraph()
        p2.text = label.upper()
        p2.font.name = 'Consolas'
        p2.font.size = Pt(14)
        p2.font.color.rgb = CREAM
        p2.alignment = PP_ALIGN.CENTER
        
    def add_flow_box(slide, text, left, top, width, height, color=CHARCOAL, border=CREAM, text_color=CREAM, font_size=16):
        shape = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE,
            Inches(left), Inches(top), Inches(width), Inches(height)
        )
        shape.fill.solid()
        shape.fill.fore_color.rgb = color
        shape.line.color.rgb = border
        shape.line.width = Pt(2)
        
        tf = shape.text_frame
        tf.word_wrap = True
        p = tf.add_paragraph()
        p.text = text
        p.font.name = 'Consolas'
        p.font.size = Pt(font_size)
        p.font.color.rgb = text_color
        p.alignment = PP_ALIGN.CENTER
        return shape

    def add_arrow(slide, start_x, start_y, end_x, end_y):
        connector = slide.shapes.add_connector(
            MSO_CONNECTOR.STRAIGHT, Inches(start_x), Inches(start_y), Inches(end_x), Inches(end_y)
        )
        connector.line.color.rgb = CREAM
        connector.line.width = Pt(2)
        # Add head to the arrow (tail is at start, head is at end)
        # python-pptx handles arrowheads via XML injection or by simple line formatting if supported,
        # but for clean Brutalism, thick straight lines between boxes serve perfectly as grid connectors.

    # --- SLIDES ---
    
    # Slide 1: TITLE
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_dark_background(slide)
    
    tag = slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(4), Inches(0.5))
    tag.text_frame.text = "[ PROJECT IDENTIFIER: MEDI-VISION ]"
    tag.text_frame.paragraphs[0].font.name = 'Consolas'
    tag.text_frame.paragraphs[0].font.color.rgb = SAGE
    
    title = add_brutalist_title(slide, "MEDIVISION AI.", 2.5)
    title.text_frame.paragraphs[0].font.size = Pt(90)
    
    add_brutalist_subtitle(slide, "INTELLIGENT CLINICAL COLLABORATION PLATFORM", 4.0)
    add_body_text(slide, "Integrating OpenMEDLab Foundation Models & MixFormer (CVPR 2022).", 4.8)


    # Slide 2: OPENMEDLAB FOUNDATION MODELS
    slide2 = prs.slides.add_slide(prs.slide_layouts[6])
    set_dark_background(slide2)
    add_brutalist_title(slide2, "OPENMEDLAB FOUNDATION MODELS.")
    add_brutalist_subtitle(slide2, "[ARCHITECTURE] MEDICAL-SPECIFIC AI PIPELINES", 1.8)
    
    om_text = (
        "We are transitioning from generic YOLO detection to highly specialized Medical Foundation Models:\n\n"
        "✦ SAM-Med2D/3D: Segment Anything Model adapted for CT volumetric & pixel-level medical segmentation.\n"
        "✦ RETFound: Retinal image foundation model trained on 1.6M images using MAE (ViT-Large).\n"
        "✦ Endo-FM: Video Transformer with dynamic spatial-temporal positional encoding for Endoscopy.\n"
        "✦ PULSE LLM: Multi-task Vision-Language framework for clinical NLP and report generation."
    )
    add_body_text(slide2, om_text, 2.5)
    
    # Mini stats for openmed
    add_stat_box(slide2, "1.6M+", "RETINAL VIT SCANS", 0.8, 5.5, 3.5)
    add_stat_box(slide2, "3D", "VOLUMETRIC SEGMENTATION", 4.8, 5.5, 3.5)
    add_stat_box(slide2, "NLP", "PULSE MEDICAL LLM", 8.8, 5.5, 3.5)


    # Slide 3: MIXFORMER & TEMPORAL TRACKING
    slide3 = prs.slides.add_slide(prs.slide_layouts[6])
    set_dark_background(slide3)
    add_brutalist_title(slide3, "MIXFORMER (CVPR 2022 SOTA).")
    add_brutalist_subtitle(slide3, "[TRACKING] REAL-TIME LESION TEMPORAL EVOLUTION", 1.8)
    
    mf_text = (
        "MixFormer introduces End-to-End Tracking with Iterative Mixed Attention (MAM):\n\n"
        "➢ SOTA ARCHITECTURE: Replaces traditional 'extract features -> correlate' with simultaneous target-search integration.\n"
        "➢ MIXED ATTENTION MODULE (MAM): Computes Self-Attention and Cross-Attention concurrently in a unified block.\n"
        "➢ LIVE SURGERY: Enables robust, frame-by-frame lesion tracking during live clinical video streams.\n"
        "➢ LOCALIZATION HEAD: DETR-inspired learnable regression token requiring ZERO post-processing."
    )
    add_body_text(slide3, mf_text, 2.5)
    
    add_stat_box(slide3, "86.1%", "TRACKINGNET AUC", 0.8, 5.5, 3.5)
    add_stat_box(slide3, "0.584", "VOT2020 EAO SCORE", 4.8, 5.5, 3.5)
    add_stat_box(slide3, "LIVE", "WEB-RTC TRACKING", 8.8, 5.5, 3.5)


    # Slide 4: AI ARCHITECTURE FLOWCHART
    slide4 = prs.slides.add_slide(prs.slide_layouts[6])
    set_dark_background(slide4)
    add_brutalist_title(slide4, "SYSTEM ARCHITECTURE FLOW.")
    
    # Input Level
    add_flow_box(slide4, "MEDICAL INPUT\n(Still / Video)", 1.0, 2.3, 2.5, 1.0, color=CREAM, text_color=CHARCOAL)
    
    # Process Level (Left to Right after Input)
    add_arrow(slide4, 3.5, 2.8, 4.5, 2.8)
    
    # Foundation Column
    add_flow_box(slide4, "OPENMEDLAB\nSAM-Med2D/3D (Seg)\nRETFound / Endo-FM", 4.5, 1.8, 3.0, 1.0, border=SAGE)
    add_flow_box(slide4, "MIXFORMER (CVPR 2022)\nReal-Time Lesion\nTracking Engine", 4.5, 3.2, 3.0, 1.0, border=SAGE)
    add_flow_box(slide4, "PULSE LLM\nMedical NLP\nReport Generation", 4.5, 4.6, 3.0, 1.0, border=SAGE)
    
    # Connect Inputs to Foundation
    add_arrow(slide4, 4.0, 2.8, 4.0, 2.3) # Line up to top box
    add_arrow(slide4, 4.0, 2.8, 4.0, 5.1) # Line down to bottom box
    add_arrow(slide4, 4.0, 2.3, 4.5, 2.3) # Pointer to top
    add_arrow(slide4, 4.0, 5.1, 4.5, 5.1) # Pointer to bottom
    
    # Synthesis Level
    add_arrow(slide4, 7.5, 2.3, 8.5, 3.2)
    add_arrow(slide4, 7.5, 3.7, 8.5, 3.7)
    add_arrow(slide4, 7.5, 5.1, 8.5, 4.2)
    
    add_flow_box(slide4, "MULTI-AGENT\nCONSENSUS ENGINE\n(Synthesis)", 8.5, 2.8, 3.5, 1.8, color=CHARCOAL, border=CREAM, text_color=SAGE, font_size=20)


    # Slide 5: CORE INNOVATIONS (SUMMARY)
    slide5 = prs.slides.add_slide(prs.slide_layouts[6])
    set_dark_background(slide5)
    add_brutalist_title(slide5, "CORE PIPELINE INNOVATIONS.")
    
    innov_text = (
        "WHY MEDIVISION STANDS APART:\n\n"
        "➢ LIQUID CANVAS UI: Interactive WebGL-inspired fluidity minimizing cognitive overhead.\n"
        "➢ EDGE-AI HYBRID: Client-side MixFormer tracking mixed with secure cloud validation.\n"
        "➢ OPENMED PIPELINES: Not just bounding boxes—native pixel-level segmentation & 3D CT volumetrics.\n"
        "➢ ASYMMETRIC ENCRYPTION: HIPAA-compliant peer-to-peer WebSocket routing."
    )
    add_body_text(slide5, innov_text, 2.2)
    
    # Slide 6: END
    slide6 = prs.slides.add_slide(prs.slide_layouts[6])
    set_dark_background(slide6)
    
    sh = add_brutalist_title(slide6, "CREATE. DIAGNOSE. HEAL. TOGETHER.", 3.0)
    sh.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER
    sh.text_frame.paragraphs[0].font.color.rgb = SAGE
    
    sh2 = add_body_text(slide6, "MEDIVISION AI. // SYSTEM INITIALIZED.", 4.5, left_inches=0, width_inches=13.33)
    sh2.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    prs.save('MediVision_Technical_Jury.pptx')
    print("Presentation generated successfully: 'MediVision_Technical_Jury.pptx'")

if __name__ == '__main__':
    create_medivision_presentation()
