import React from "react";
import { View, type ViewProps } from "react-native";
import { useSafeAreaInsets, type Edge } from "react-native-safe-area-context";

interface ScreenContainerProps extends ViewProps {
  edges?: readonly Edge[];
}

const ALL_EDGES: readonly Edge[] = ["top", "right", "bottom", "left"];

// Re-reads insets on every change so system bars (gesture or 3-button navigation) never overlap content
export function ScreenContainer({
  edges = ALL_EDGES,
  style,
  children,
  ...rest
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const insetStyle = {
    paddingTop: edges.includes("top") ? insets.top : 0,
    paddingRight: edges.includes("right") ? insets.right : 0,
    paddingBottom: edges.includes("bottom") ? insets.bottom : 0,
    paddingLeft: edges.includes("left") ? insets.left : 0,
  };

  return (
    <View {...rest} style={[insetStyle, style]}>
      {children}
    </View>
  );
}
