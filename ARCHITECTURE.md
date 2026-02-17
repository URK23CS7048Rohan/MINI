<p align="center">
  <strong>🧠 MediVision AI — Future Model Architecture</strong>
</p>

<p align="center">
  <em>OpenMEDLab Foundation Models + MixFormer (CVPR 2022 SOTA) Integration Blueprint</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Planned-F59E0B" alt="Status" />
  <img src="https://img.shields.io/badge/OpenMEDLab-Foundation%20Models-10B981" alt="OpenMEDLab" />
  <img src="https://img.shields.io/badge/MixFormer-CVPR%202022-8B5CF6" alt="MixFormer" />
  <img src="https://img.shields.io/badge/Architecture-Documentation-3B82F6" alt="Architecture" />
</p>

> **⚠️ STATUS: ARCHITECTURE ONLY — NOT IMPLEMENTED YET**
>
> This document details the planned integration of **OpenMEDLab foundation models** and **MixFormer (CVPR 2022 SOTA)** into MediVision AI. These models are **not yet implemented** in the codebase. This serves as the architectural blueprint for future integration.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [OpenMEDLab Foundation Models](#-openmedlab-foundation-models)
  - [Platform Architecture](#platform-architecture)
  - [SAM-Med2D](#sam-med2d---2d-medical-image-segmentation)
  - [SAM-Med3D](#sam-med3d---3d-volumetric-segmentation)
  - [RETFound](#retfound---retinal-foundation-model)
  - [Endo-FM](#endo-fm---endoscopy-video-foundation-model)
  - [PULSE](#pulse---medical-language-model)
  - [MIS-FM](#mis-fm---3d-ct-segmentation)
- [MixFormer — CVPR 2022 SOTA](#-mixformer--cvpr-2022-sota)
  - [Core Architecture](#core-architecture)
  - [Mixed Attention Module (MAM)](#mixed-attention-module-mam)
  - [Backbone Variants](#backbone-variants)
  - [Localization Head](#localization-head)
  - [Performance Benchmarks](#performance-benchmarks)
- [Combined Integration Plan](#-combined-integration-plan)
- [Proposed Pipeline](#-proposed-medivision-ai-enhanced-pipeline)
- [Comparison: Current vs. Planned](#-comparison-current-vs-planned)
- [Research References](#-research-references)

---

## 🌟 Overview

MediVision AI currently uses **Roboflow YOLO models** for medical image detection. The planned upgrade will integrate:

1. **OpenMEDLab Foundation Models** — Pre-trained medical-specific foundation models for segmentation, language understanding, retinal analysis, and endoscopy, providing far deeper medical understanding than generic detection.
2. **MixFormer (CVPR 2022)** — State-of-the-art transformer-based tracking architecture using Mixed Attention Modules for real-time lesion tracking and temporal analysis during live consultations.

```mermaid
graph TB
    subgraph Current["🔵 Current Architecture"]
        YOLO["YOLO Detection Models<br/>(Roboflow API)"]
        YOLO --> BB["Bounding Boxes<br/>+ Classification"]
    end

    subgraph Planned["🟢 Planned Architecture"]
        OM["OpenMEDLab<br/>Foundation Models"]
        MF["MixFormer<br/>(CVPR 2022 SOTA)"]

        OM --> SEG["Pixel-Level<br/>Segmentation"]
        OM --> NLP["Medical NLP<br/>+ Report Generation"]
        OM --> RET["Retinal<br/>Disease Analysis"]
        OM --> ENDO["Endoscopy<br/>Video Analysis"]

        MF --> TRACK["Real-Time<br/>Lesion Tracking"]
        MF --> TEMP["Temporal<br/>Evolution Analysis"]
    end

    Current -.->|upgrade| Planned

    style Current fill:#DBEAFE,color:#1E3A5F
    style Planned fill:#D1FAE5,color:#064E3B
```

---

## 🏥 OpenMEDLab Foundation Models

### Platform Architecture

OpenMEDLab is an open-source platform from Shanghai AI Laboratory providing medical foundation models pre-trained on massive de-identified medical datasets via self-supervised learning.

```mermaid
graph TB
    subgraph OpenMEDLab["🏥 OpenMEDLab Platform"]

        subgraph ImageModels["🖼️ Medical Imaging Models"]
            SAM2D["SAM-Med2D<br/>2D Segmentation<br/>4.6M images, 19.7M masks"]
            SAM3D["SAM-Med3D<br/>3D Volumetric Segmentation<br/>Full 3D ViT Architecture"]
            MISFM["MIS-FM<br/>3D CT Segmentation<br/>Specialized for CT"]
            DLMB["D-LMBmap<br/>Whole-Brain Axon<br/>Neural Circuitry"]
        end

        subgraph DomainModels["🔬 Domain-Specific Models"]
            RETF["RETFound<br/>Retinal Images<br/>1.6M images, ViT-Large"]
            ENDOFM["Endo-FM<br/>Endoscopy Video<br/>Video Transformer"]
        end

        subgraph LanguageModels["📝 Medical Language Models"]
            PUL["PULSE<br/>Medical LLM<br/>Multi-task VL Framework"]
        end
    end

    subgraph Training["🎓 Pre-Training Strategy"]
        SS["Self-Supervised Learning"]
        MAE["Masked Autoencoder<br/>(MAE)"]
        TS["Teacher-Student<br/>Framework"]
        CL["Continual Pretraining<br/>+ SFT"]
    end

    subgraph Data["📊 Training Data Sources"]
        D1["Medical Textbooks"]
        D2["Clinical Guidelines"]
        D3["EHR Records"]
        D4["De-identified Images"]
        D5["Endoscopy Videos"]
        D6["Retinal Scans"]
    end

    Data --> Training
    Training --> OpenMEDLab

    style OpenMEDLab fill:#ECFDF5,color:#064E3B
    style Training fill:#FEF3C7,color:#78350F
    style Data fill:#EDE9FE,color:#3B0764
```

---

### SAM-Med2D — 2D Medical Image Segmentation

**Based on:** Segment Anything Model (SAM), fine-tuned on SA-Med2D-20M dataset

```mermaid
flowchart LR
    subgraph Input["📥 Input"]
        IMG["2D Medical Image<br/>(X-ray, CT slice, etc.)"]
        PR["Prompts<br/>(Points, Boxes, Masks)"]
    end

    subgraph Encoder["🔷 Image Encoder"]
        VIT["Vision Transformer<br/>(ViT — Frozen)"]
        ADP["Adapter Layers<br/>(Fine-tuned per<br/>Transformer Block)"]
        VIT --> ADP
    end

    subgraph PromptEnc["🔶 Prompt Encoder"]
        SPR["Sparse Prompts<br/>(Points + Boxes)"]
        DPR["Dense Prompts<br/>(Masks)"]
    end

    subgraph Decoder["🟢 Mask Decoder"]
        CA["Cross-Attention<br/>(Image × Prompt)"]
        MP["Mask Prediction<br/>Head"]
        CA --> MP
    end

    IMG --> Encoder
    PR --> PromptEnc
    Encoder --> Decoder
    PromptEnc --> Decoder
    Decoder --> OUT["🎯 Segmentation Mask"]

    style Encoder fill:#DBEAFE,color:#1E3A5F
    style PromptEnc fill:#FEF3C7,color:#78350F
    style Decoder fill:#D1FAE5,color:#064E3B
```

| Specification | Details |
|--------------|---------|
| **Base Model** | Segment Anything Model (SAM) |
| **Encoder** | ViT (frozen) + Learnable Adapter Layers |
| **Training Data** | SA-Med2D-20M: 4.6M images, 19.7M masks |
| **Prompt Types** | Points, bounding boxes, dense masks |
| **Fine-tuned Components** | Adapter layers, prompt encoder, mask decoder |
| **Modalities** | X-ray, CT, MRI, ultrasound, endoscopy, dermoscopy |

---

### SAM-Med3D — 3D Volumetric Segmentation

**Architecture:** Fully native 3D — not adapted from 2D

```mermaid
flowchart TD
    subgraph Input3D["📥 3D Input"]
        VOL["Volumetric Scan<br/>(128³ patches)<br/>CT / MRI Volume"]
        P3D["3D Prompts<br/>(Points, Boxes)"]
    end

    subgraph Encoder3D["🔷 3D Image Encoder"]
        PE3D["3D Patch Embedding<br/>(Learnable)"]
        POS3D["3D Absolute<br/>Positional Encoding"]
        TF3D["3D Transformer Layers<br/>Multi-Head Self-Attention<br/>+ Volumetric Relative Bias"]

        PE3D --> POS3D --> TF3D
    end

    subgraph PromptEnc3D["🔶 3D Prompt Encoder"]
        LT["Learned Linear<br/>Transformations"]
        PE3DP["3D Positional<br/>Embeddings"]
        CN["3D Conv Neck<br/>(for dense masks)"]
    end

    subgraph Decoder3D["🟢 3D Mask Decoder"]
        FUSE["Cross-Attention Fusion<br/>(Image ⊕ Prompt)"]
        VOLMASK["Volumetric Mask<br/>Generation"]
        FUSE --> VOLMASK
    end

    VOL --> Encoder3D
    P3D --> PromptEnc3D
    Encoder3D --> Decoder3D
    PromptEnc3D --> Decoder3D
    Decoder3D --> OUT3D["🎯 3D Segmentation Volume"]

    style Encoder3D fill:#DBEAFE,color:#1E3A5F
    style PromptEnc3D fill:#FEF3C7,color:#78350F
    style Decoder3D fill:#D1FAE5,color:#064E3B
```

---

### RETFound — Retinal Foundation Model

**Pre-trained on:** 1.6M retinal images using Masked Autoencoder (MAE)

```mermaid
flowchart LR
    subgraph Pretrain["🎓 Pre-Training (MAE)"]
        RI["1.6M Retinal Images"]
        PATCH["Split into<br/>16×16 Patches"]
        MASK["Random Masking<br/>(75% masked)"]
        ENC_P["ViT-Large Encoder<br/>(24 Blocks, dim=1024,<br/>16 Attention Heads)"]
        DEC_P["MAE Decoder<br/>(Reconstruct Masked)"]

        RI --> PATCH --> MASK --> ENC_P --> DEC_P
    end

    subgraph Finetune["⚡ Fine-Tuning"]
        FT_DATA["Disease-Specific<br/>Labeled Data"]
        ENC_FT["ViT-Large Encoder<br/>(Fine-tuned weights)"]
        CLS["Classification Head<br/>(Disease Detection)"]

        FT_DATA --> ENC_FT --> CLS
    end

    subgraph Tasks["🎯 Downstream Tasks"]
        T1["Diabetic Retinopathy<br/>Detection"]
        T2["Glaucoma<br/>Screening"]
        T3["Macular<br/>Degeneration"]
        T4["Cardiovascular<br/>Risk Prediction"]
    end

    Pretrain -.->|Transfer weights| Finetune
    Finetune --> Tasks

    style Pretrain fill:#EDE9FE,color:#3B0764
    style Finetune fill:#FEF3C7,color:#78350F
    style Tasks fill:#D1FAE5,color:#064E3B
```

| Specification | Details |
|--------------|---------|
| **Architecture** | ViT-Large (24 transformer blocks) |
| **Embedding Dim** | 1024 |
| **Attention Heads** | 16 |
| **Patch Size** | 16 × 16 |
| **Pre-training Data** | 1.6M unlabeled retinal images |
| **Pre-training Method** | Masked Autoencoder (MAE) |
| **Downstream Tasks** | DR, glaucoma, AMD, cardiovascular risk |

---

### Endo-FM — Endoscopy Video Foundation Model

**Architecture:** Video Transformer with dynamic spatial-temporal positional encoding

```mermaid
flowchart TD
    subgraph Input_E["📥 Endoscopy Video"]
        VF["Video Frames<br/>(Variable FPS/Resolution)"]
    end

    subgraph TeacherStudent["🎓 Pre-Training (Self-Supervised)"]
        direction LR
        subgraph Teacher["👨‍🏫 Teacher Model"]
            T_ENC["Video Transformer<br/>(EMA Updated)"]
        end
        subgraph Student["🎓 Student Model"]
            S_ENC["Video Transformer<br/>(Gradient Updated)"]
        end
        MATCH["Spatial-Temporal<br/>View Matching<br/>(Latent Space)"]

        Teacher --> MATCH
        Student --> MATCH
    end

    subgraph Architecture_E["🔷 Endo-FM Architecture"]
        DSTPE["Dynamic Spatial-Temporal<br/>Positional Encoding"]
        LOCAL["Local Dependencies<br/>(Spatial Attention)"]
        GLOBAL["Global Dependencies<br/>(Temporal Attention)"]

        DSTPE --> LOCAL
        DSTPE --> GLOBAL
    end

    subgraph Tasks_E["🎯 Downstream Tasks"]
        T_E1["Polyp Detection"]
        T_E2["Lesion Segmentation"]
        T_E3["Scene Classification"]
        T_E4["Surgical Phase<br/>Recognition"]
    end

    VF --> TeacherStudent
    TeacherStudent -.->|Pre-trained weights| Architecture_E
    Architecture_E --> Tasks_E

    style TeacherStudent fill:#EDE9FE,color:#3B0764
    style Architecture_E fill:#DBEAFE,color:#1E3A5F
    style Tasks_E fill:#D1FAE5,color:#064E3B
```

---

### PULSE — Medical Language Model

**Type:** Multi-task Vision-Language framework

```mermaid
flowchart LR
    subgraph Data_P["📊 Training Data"]
        D_TB["Medical<br/>Textbooks"]
        D_GL["Clinical<br/>Guidelines"]
        D_EHR["EHR<br/>Records"]
        D_QA["Web<br/>Q&A Data"]
    end

    subgraph Training_P["🎓 Training Pipeline"]
        CP["Continual<br/>Pre-training"]
        SFT["Supervised<br/>Fine-tuning"]
        CP --> SFT
    end

    subgraph PULSE_Arch["🧠 PULSE Architecture"]
        VIT_P["Self-Supervised ViT<br/>(Semantic Backbone)"]
        PYR["Multiscale Pyramid<br/>Decoder"]
        SHARED["Shared Global<br/>Representations"]

        VIT_P --> PYR
        VIT_P --> SHARED
    end

    subgraph Outputs_P["🎯 Multi-Task Outputs"]
        SEG_P["Anatomical<br/>Segmentation"]
        CLASS_P["Disease<br/>Classification"]
        TEXT_P["Clinical Text<br/>Generation"]
    end

    Data_P --> Training_P --> PULSE_Arch
    PYR --> SEG_P
    SHARED --> CLASS_P
    SHARED --> TEXT_P

    style PULSE_Arch fill:#DBEAFE,color:#1E3A5F
    style Outputs_P fill:#D1FAE5,color:#064E3B
```

---

### MIS-FM — 3D CT Segmentation

| Specification | Details |
|--------------|---------|
| **Task** | 3D CT volumetric segmentation |
| **Input** | Full 3D CT scans |
| **Approach** | Foundation model specialized for CT modality |
| **Targets** | Organ segmentation, lesion delineation, anatomical structures |

---

## ⚡ MixFormer — CVPR 2022 SOTA

### Core Architecture

> **Paper:** *"MixFormer: End-to-End Tracking with Iterative Mixed Attention"*
> **Venue:** CVPR 2022 (Oral Presentation)
> **Key Innovation:** Unified feature extraction + target integration via Mixed Attention Module (MAM)

```mermaid
flowchart TD
    subgraph Input_MF["📥 Inputs"]
        TMPL["Target Template<br/>(Reference Image)"]
        SRCH["Search Region<br/>(Current Frame)"]
    end

    subgraph Backbone_MF["🔷 MixFormer Backbone"]
        direction TB
        MAM1["Mixed Attention Module<br/>Stage 1"]
        MAM2["Mixed Attention Module<br/>Stage 2"]
        MAM3["Mixed Attention Module<br/>Stage N"]
        MAM1 --> MAM2 --> MAM3
    end

    subgraph MAM_Detail["⚙️ Mixed Attention Module (MAM)"]
        direction TB
        SA["Self-Attention<br/>(Within Template)"]
        SA2["Self-Attention<br/>(Within Search)"]
        CA_TS["Cross-Attention<br/>(Template → Search)"]
        CA_ST["Cross-Attention<br/>(Search → Template)"]

        SA --> CA_TS
        SA2 --> CA_ST
    end

    subgraph Head_MF["🟢 Localization Head"]
        REG["Regression Token<br/>(Learnable)"]
        FFN["3-Layer FFN"]
        BBOX["Bounding Box<br/>(x, y, w, h)"]
        REG --> FFN --> BBOX
    end

    TMPL --> Backbone_MF
    SRCH --> Backbone_MF
    Backbone_MF --> Head_MF

    MAM_Detail -.-|"detail of each stage"| Backbone_MF

    style Backbone_MF fill:#EDE9FE,color:#3B0764
    style MAM_Detail fill:#FEF3C7,color:#78350F
    style Head_MF fill:#D1FAE5,color:#064E3B
```

### Mixed Attention Module (MAM)

The core innovation — **simultaneous feature extraction + target-search integration** in a single module.

```mermaid
flowchart LR
    subgraph Inputs_MAM["📥 Input Tokens"]
        TT["Template Tokens<br/>[T₁, T₂, ..., Tₙ]"]
        ST["Search Tokens<br/>[S₁, S₂, ..., Sₘ]"]
    end

    subgraph Concat["🔗 Concatenation"]
        CT["[T₁...Tₙ | S₁...Sₘ]"]
    end

    subgraph DualAttn["⚡ Dual Attention"]
        QKV["Q, K, V Projections"]

        subgraph SelfAttn["Self-Attention"]
            SA_T["Template × Template"]
            SA_S["Search × Search"]
        end

        subgraph CrossAttn["Cross-Attention"]
            CA_T2S["Template × Search"]
            CA_S2T["Search × Template"]
        end

        QKV --> SelfAttn
        QKV --> CrossAttn
    end

    subgraph Output_MAM["📤 Output"]
        T_OUT["Enhanced Template<br/>Tokens"]
        S_OUT["Target-Aware Search<br/>Tokens"]
    end

    Inputs_MAM --> Concat --> DualAttn --> Output_MAM

    style DualAttn fill:#FEF3C7,color:#78350F
    style Output_MAM fill:#D1FAE5,color:#064E3B
```

**How MAM works:**
1. Template and search tokens are **concatenated** into a single sequence
2. **Self-attention** captures intra-image features (template features + search features independently)
3. **Cross-attention** enables information flow between template and search (target-aware feature extraction)
4. Both happen **simultaneously** in a single attention operation — the key innovation
5. This replaces the traditional separate "extract features → then correlate" pipeline

---

### Backbone Variants

```mermaid
graph TB
    subgraph MixFormer["🧠 MixFormer Variants"]
        subgraph MixCvT["MixCvT (Hierarchical)"]
            CVT_B["CvT Backbone<br/>(CvT-21 / CvT-24W)"]
            PD["Progressive<br/>Downsampling"]
            DWC["Depth-wise Conv<br/>Projections"]
            CVT_B --> PD --> DWC
        end

        subgraph MixViT["MixViT (Non-Hierarchical)"]
            VIT_B["ViT Backbone<br/>(Plain Transformer)"]
            MAM_V["MAM Layers<br/>(Flat Resolution)"]
            PCH["Pyramidal Corner<br/>Head"]
            VIT_B --> MAM_V --> PCH
        end
    end

    subgraph Props["Properties"]
        P1["✅ Scale Invariance"]
        P2["✅ Shift Invariance"]
        P3["✅ Distortion Invariance"]
        P4["✅ No Post-Processing"]
    end

    MixCvT --> Props
    MixViT --> Props

    style MixCvT fill:#DBEAFE,color:#1E3A5F
    style MixViT fill:#EDE9FE,color:#3B0764
    style Props fill:#D1FAE5,color:#064E3B
```

| Variant | Backbone | Type | Init Weights | Key Feature |
|---------|----------|------|-------------|-------------|
| **MixCvT** | CvT-21 / CvT-24W | Hierarchical | ImageNet pre-trained | Progressive downsampling + depth-wise conv |
| **MixViT** | ViT-Base / ViT-Large | Non-Hierarchical | MAE pre-trained | Flat resolution + pyramidal corner head |
| **MixViT-L** | ViT-Large | Non-Hierarchical | MAE pre-trained | Largest model, best accuracy |

### Localization Head

```mermaid
flowchart LR
    subgraph QueryHead["🎯 Query-Based Head (Primary)"]
        RT["Learnable<br/>Regression Token"]
        AGG["Aggregate Info<br/>(Template + Search)"]
        FFN2["3-Layer FFN"]
        BBox1["Bounding Box<br/>(cx, cy, w, h)"]
        RT --> AGG --> FFN2 --> BBox1
    end

    subgraph CornerHead["📐 Corner-Based Head (Alternative)"]
        CONV["Conv-BN-ReLU<br/>Layers"]
        TL["Top-Left<br/>Corner"]
        BR["Bottom-Right<br/>Corner"]
        BBox2["Bounding Box"]
        CONV --> TL --> BBox2
        CONV --> BR --> BBox2
    end

    style QueryHead fill:#DBEAFE,color:#1E3A5F
    style CornerHead fill:#EDE9FE,color:#3B0764
```

- **Query-based:** DETR-inspired learnable regression token → FFN → direct bbox regression → **no post-processing needed**
- **Corner-based:** STARK-inspired conv layers → estimate top-left/bottom-right corners

### Performance Benchmarks

| Benchmark | Metric | MixViT-L Score | Rank |
|-----------|--------|---------------|------|
| **LaSOT** | AUC | **73.3%** | 🥇 SOTA |
| **TrackingNet** | AUC | **86.1%** | 🥇 SOTA |
| **VOT2020** | EAO | **0.584** | 🥇 SOTA |
| **GOT-10k** | AO | — | Top-tier |
| **OTB100** | AUC | — | Top-tier |
| **UAV123** | AUC | — | Top-tier |
| **VOT2022-STb** | Rank | **1/41** | 🥇 #1 |

---

## 🔗 Combined Integration Plan

### How OpenMed + MixFormer Enhance MediVision AI

```mermaid
flowchart TD
    subgraph Input_Plan["📥 Medical Input"]
        I1["📷 Still Image<br/>(X-ray, Derma, etc.)"]
        I2["🎥 Video Stream<br/>(Live Consultation)"]
        I3["📋 Clinical Text<br/>(Patient History)"]
    end

    subgraph Stage1["Stage 1: Foundation Analysis"]
        SAM["SAM-Med2D/3D<br/>Pixel-Level Segmentation"]
        RET2["RETFound<br/>Retinal Analysis"]
        ENDO2["Endo-FM<br/>Endoscopy Analysis"]
        PULSE2["PULSE<br/>Medical NLP"]
    end

    subgraph Stage2["Stage 2: Tracking & Evolution"]
        MIX["MixFormer<br/>Real-Time Lesion Tracking"]
        EVOL["Temporal Evolution<br/>Analysis"]
        MIX --> EVOL
    end

    subgraph Stage3["Stage 3: AI Synthesis"]
        CONS2["Multi-Model<br/>AI Consensus"]
        DIAG["Comprehensive<br/>Diagnosis"]
        PLAN["Treatment<br/>Planning"]
        CONS2 --> DIAG --> PLAN
    end

    I1 --> SAM
    I1 --> RET2
    I2 --> ENDO2
    I2 --> MIX
    I3 --> PULSE2

    SAM --> CONS2
    RET2 --> CONS2
    ENDO2 --> CONS2
    PULSE2 --> CONS2
    EVOL --> CONS2

    style Stage1 fill:#DBEAFE,color:#1E3A5F
    style Stage2 fill:#EDE9FE,color:#3B0764
    style Stage3 fill:#D1FAE5,color:#064E3B
```

---

## 🏭 Proposed MediVision AI Enhanced Pipeline

### End-to-End Processing Flow

```mermaid
sequenceDiagram
    participant D as 👨‍⚕️ Doctor
    participant UI as 🖥️ MediVision UI
    participant YOLO as 🔍 YOLO (Existing)
    participant SAM as 🔬 SAM-Med2D/3D
    participant RET as 👁️ RETFound
    participant ENDO as 📹 Endo-FM
    participant MIX as 🎯 MixFormer
    participant PULSE as 📝 PULSE LLM
    participant CONS as 🤝 Consensus Engine

    D->>UI: Upload Image / Start Webcam
    UI->>YOLO: Quick Detection (existing)
    YOLO-->>UI: Bounding Boxes + Labels

    par Parallel Foundation Analysis
        UI->>SAM: Precise Segmentation
        SAM-->>UI: Pixel-Level Masks
    and
        UI->>RET: Retinal Analysis (if fundus)
        RET-->>UI: Disease Classification
    and
        UI->>ENDO: Video Analysis (if endoscopy)
        ENDO-->>UI: Scene + Pathology
    end

    UI->>MIX: Track Lesion (video frames)
    MIX-->>UI: Tracked Region Over Time

    UI->>PULSE: Generate Clinical Summary
    PULSE-->>UI: NLP Report

    UI->>CONS: Aggregate All Model Outputs
    CONS-->>UI: Unified Diagnosis + Confidence
    UI-->>D: Rich Diagnostic Report
```

---

## 📊 Comparison: Current vs. Planned

| Capability | Current (YOLO) | Planned (OpenMed + MixFormer) |
|-----------|---------------|-------------------------------|
| **Detection** | Bounding box classification | ✅ + Pixel-level segmentation |
| **Segmentation** | ❌ Not supported | ✅ SAM-Med2D/3D |
| **3D Volume Analysis** | ❌ Not supported | ✅ SAM-Med3D |
| **Retinal Specialist** | Generic eye model | ✅ RETFound (1.6M images) |
| **Video Analysis** | Frame-by-frame YOLO | ✅ Endo-FM + MixFormer |
| **Real-Time Tracking** | ❌ No tracking | ✅ MixFormer MAM |
| **Temporal Evolution** | Manual comparison | ✅ Automated with MixFormer |
| **Medical NLP** | OpenAI (general) | ✅ PULSE (medical-specific) |
| **Pre-training Data** | Limited per model | ✅ Millions of medical images |
| **Post-Processing** | Required | ✅ End-to-end (MixFormer) |

---

## 📚 Research References

| Model | Paper | Venue | Repository |
|-------|-------|-------|-----------|
| **OpenMEDLab** | Platform for Medical Foundation Models | — | [github.com/openmedlab](https://github.com/openmedlab) |
| **SAM-Med2D** | SAM-Med2D: Medical Image Segmentation | arXiv 2023 | [github.com/openmedlab/SAM-Med2D](https://github.com/openmedlab/SAM-Med2D) |
| **SAM-Med3D** | SAM-Med3D: Volumetric Medical Image Segmentation | arXiv 2023 | [github.com/openmedlab/SAM-Med3D](https://github.com/openmedlab/SAM-Med3D) |
| **RETFound** | A foundation model for generalizable disease detection from retinal images | Nature 2023 | [github.com/rmaphoh/RETFound_MAE](https://github.com/rmaphoh/RETFound_MAE) |
| **Endo-FM** | Foundation Model for Endoscopy Video Analysis | arXiv 2023 | [github.com/openmedlab/Endo-FM](https://github.com/openmedlab/Endo-FM) |
| **PULSE** | Medical Large Language Model | arXiv 2023 | [github.com/openmedlab/PULSE](https://github.com/openmedlab/PULSE) |
| **MixFormer** | End-to-End Tracking with Iterative Mixed Attention | **CVPR 2022 (Oral)** | [github.com/MCG-NJU/MixFormer](https://github.com/MCG-NJU/MixFormer) |

---

<p align="center">
  <strong>📋 This is an architecture document only — Implementation pending</strong>
</p>
<p align="center">
  <em>MediVision AI — Advancing Healthcare with Foundation Models</em>
</p>
