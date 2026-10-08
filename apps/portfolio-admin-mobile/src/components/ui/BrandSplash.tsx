import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View, useWindowDimensions } from "react-native";
import { brandDomain } from "../../config/env";

const AVATAR_SIZE = 200;
const TEXT_GAP = 28;
const ENTER_MS = 600;
const HOLD_MS = 1400;
const EXIT_MS = 450;

interface BrandSplashProps {
  onFinish: () => void;
}

// Avatar size and background match the native splash so the handoff is seamless
export function BrandSplash({ onFinish }: BrandSplashProps) {
  const { height } = useWindowDimensions();
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textOffset = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: ENTER_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOffset, {
          toValue: 0,
          duration: ENTER_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(HOLD_MS),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: EXIT_MS,
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) onFinish();
    });

    return () => animation.stop();
  }, [containerOpacity, textOffset, textOpacity, onFinish]);

  const textTop = height / 2 + AVATAR_SIZE / 2 + TEXT_GAP;

  return (
    <Animated.View
      pointerEvents="auto"
      className="absolute inset-0 bg-[#040e24] items-center justify-center"
      style={{ opacity: containerOpacity }}
    >
      <Image
        source={require("../../../assets/images/splash-icon.png")}
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        resizeMode="contain"
      />

      <Animated.View
        className="absolute items-center"
        style={{
          top: textTop,
          opacity: textOpacity,
          transform: [{ translateY: textOffset }],
        }}
      >
        <Text className="text-xl font-bold text-slate-50 tracking-wide">{brandDomain}</Text>
        <View className="mt-3 h-[2px] w-12 rounded-full bg-amber-400" />
        <Text className="mt-3 text-[11px] font-semibold uppercase tracking-[3px] text-amber-300/90">
          Executive CMS
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
