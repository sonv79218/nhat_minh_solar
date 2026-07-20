// ============================================
// CATEGORY ICONS MAPPING
// ============================================
import {
  Camera,
  Plug,
  ToggleRight,
  Radio,
  Lightbulb,
  Lock,
  Speaker,
  Tv,
  Fan,
  Boxes,
  Zap,
  Shield,
  Wifi,
  Home,
} from "lucide-react";

export const categoryIcons = {
  camera: Camera,
  "smart-camera": Camera,
  "camera-outdoor": Camera,
  "camera-indoor": Camera,
  
  "smart-plug": Plug,
  plug: Plug,
  socket: Plug,
  
  "smart-switch": ToggleRight,
  switch: ToggleRight,
  "wall-switch": ToggleRight,
  
  sensor: Radio,
  "motion-sensor": Radio,
  "door-sensor": Radio,
  "temperature-sensor": Radio,
  
  "smart-light": Lightbulb,
  light: Lightbulb,
  "smart-bulb": Lightbulb,
  lighting: Lightbulb,
  
  "smart-lock": Lock,
  lock: Lock,
  "door-lock": Lock,
  
  "smart-speaker": Speaker,
  speaker: Speaker,
  "smart-display": Speaker,
  
  "smart-tv": Tv,
  tv: Tv,
  "smart-display-tv": Tv,
  
  "smart-ac": Fan,
  ac: Fan,
  "air-conditioner": Fan,
  climate: Fan,
  
  hub: Boxes,
  gateway: Boxes,
  "smart-hub": Boxes,
  
  security: Shield,
  "security-system": Shield,
  alarm: Shield,
  
  network: Wifi,
  wifi: Wifi,
  router: Wifi,
  
  default: Home,
};

export const getCategoryIcon = (categoryId) => {
  const IconComponent = categoryIcons[categoryId] || categoryIcons.default;
  return IconComponent;
};

export default categoryIcons;
