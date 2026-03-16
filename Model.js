// SoilSense Model Data - Malawi Version
const MODEL = {
    "feature_names": ["PH", "OC", "Mg", "N", "P", "K", "Zn", "Fe", "Cu", "Mn", "Sand", "Silt", "Clay", "CaCO3", "CEC", "Moisture_Content"],
    "classes": ["High", "Low", "Medium"],
    "feature_stats": {
        "PH": { "min": 5.0, "max": 8.0, "clip_lower": 3.31, "clip_upper": 9.2 },
        "OC": { "min": 0.17, "max": 5.8, "clip_lower": -1.26, "clip_upper": 5.8 },
        "Mg": { "min": 0.11, "max": 7.95, "clip_lower": -2.0, "clip_upper": 7.95 },
        "N": { "min": 8.0, "max": 499.0, "clip_lower": -325.0, "clip_upper": 635.0 },
        "P": { "min": 3.0, "max": 52.69, "clip_lower": -11.0, "clip_upper": 52.69 },
        "K": { "min": 10.0, "max": 480.0, "clip_lower": -281.0, "clip_upper": 571.0 },
        "Zn": { "min": 0.01, "max": 2.36, "clip_lower": -0.68, "clip_upper": 2.36 },
        "Fe": { "min": 1.26, "max": 11.52, "clip_lower": -1.82, "clip_upper": 11.52 },
        "Cu": { "min": 0.2, "max": 0.99, "clip_lower": -0.24, "clip_upper": 1.41 },
        "Mn": { "min": 0.27, "max": 9.6, "clip_lower": -2.8, "clip_upper": 10.62 },
        "Sand": { "min": 35.4, "max": 118.28, "clip_lower": 35.4, "clip_upper": 118.28 },
        "Silt": { "min": 1.8, "max": 18.16, "clip_lower": -1.7, "clip_upper": 18.16 },
        "Clay": { "min": 2.08, "max": 17.65, "clip_lower": 0.9, "clip_upper": 17.65 },
        "CaCO3": { "min": 1.06, "max": 18.0, "clip_lower": -2.46, "clip_upper": 18.0 },
        "CEC": { "min": 1.4, "max": 24.24, "clip_lower": -5.38, "clip_upper": 24.24 },
        "Moisture_Content": { "min": 10.0, "max": 29.1, "clip_lower": 8.9, "clip_upper": 30.54 }
    },
    "optimal_ranges": {
        "PH": { "min": 6.0, "max": 7.0 },
        "OC": { "min": 2.0, "max": 5.0 },
        "N": { "min": 200, "max": 500 },
        "P": { "min": 15, "max": 50 },
        "K": { "min": 200, "max": 480 },
        "Moisture_Content": { "min": 15, "max": 25 }
    },
    "good_thresholds": {
        "N": 120,
        "P": 12,
        "K": 150
    },
    "rf_acc": 94.3,
    "xgb_acc": 96.8
};

// Make MODEL available globally
window.MODEL = MODEL;
