"use client";

import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// ========== Theme Colors ==========
export const themeColors = {
    light: {
        primary: "#6366f1", // Indigo
        secondary: "#a855f7", // Purple
        accent: "#ec4899", // Pink
        background: "#ffffff",
        surface: "#f8fafc",
        text: "#1e293b",
        textSecondary: "#64748b",
        border: "#e2e8f0",
    },
    dark: {
        primary: "#818cf8", // Indigo lighter
        secondary: "#c084fc", // Purple lighter
        accent: "#f472b6", // Pink lighter
        background: "#0f172a",
        surface: "#1e293b",
        text: "#f1f5f9",
        textSecondary: "#94a3b8",
        border: "#334155",
    },
};

// ========== Keyframe Animations ==========
const float = keyframes`
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-20px) translateX(10px);
  }
  66% {
    transform: translateY(10px) translateX(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// ========== Styled Components ==========

export const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #faf5ff 100%);
  
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e1b4b 100%);
  }
`;

export const StyledGradientBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.03) 0%,
    rgba(168, 85, 247, 0.03) 25%,
    rgba(236, 72, 153, 0.03) 50%,
    rgba(99, 102, 241, 0.03) 75%,
    rgba(168, 85, 247, 0.03) 100%
  );
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  pointer-events: none;
  z-index: 1;
  
  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      135deg,
      rgba(99, 102, 241, 0.08) 0%,
      rgba(168, 85, 247, 0.08) 25%,
      rgba(236, 72, 153, 0.08) 50%,
      rgba(99, 102, 241, 0.08) 75%,
      rgba(168, 85, 247, 0.08) 100%
    );
    background-size: 400% 400%;
    animation: ${gradientShift} 15s ease infinite;
  }
`;

export const StyledFloatingOrbs = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
    animation: ${float} 20s ease-in-out infinite;
  }

  &::before {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent);
    top: -250px;
    right: -250px;
    animation-delay: 0s;
  }

  &::after {
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.4), transparent);
    bottom: -200px;
    left: -200px;
    animation-delay: -10s;
  }

  @media (max-width: 768px) {
    &::before,
    &::after {
      filter: blur(60px);
      opacity: 0.1;
    }

    &::before {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -150px;
    }

    &::after {
      width: 250px;
      height: 250px;
      bottom: -125px;
      left: -125px;
    }
  }
`;

export const StyledMessageContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.4s ease-out;
  flex-direction: ${({ isUser }) => (isUser ? "row-reverse" : "row")};

  @media (max-width: 640px) {
    gap: 8px;
    margin-bottom: 16px;
  }
`;

export const StyledAvatar = styled.div<{ isUser: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 11px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  background: ${({ isUser }) =>
    isUser
      ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)"
      : "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)"};
  color: white;

  &:hover {
    transform: scale(1.1) rotate(5deg);
  }

  @media (max-width: 640px) {
    width: 36px;
    height: 36px;
    font-size: 10px;
  }
`;

export const StyledMessageBubble = styled.div<{ isUser: boolean }>`
  padding: 16px 20px;
  border-radius: 20px;
  max-width: 85%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  animation: ${scaleIn} 0.3s ease-out;
  background: ${({ isUser }) =>
    isUser
      ? "linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%)"
      : "#ffffff"};
  border: ${({ isUser }) => (isUser ? "none" : "1px solid #e5e7eb")};
  color: #1f2937;

  &:hover {
    transform: scale(1.005);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ isUser }) =>
      isUser
        ? "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)"
        : "rgba(30, 41, 59, 0.6)"};
    border: ${({ isUser }) =>
      isUser ? "none" : "1px solid rgba(51, 65, 85, 0.6)"};
    color: #f1f5f9;
  }

  @media (max-width: 640px) {
    padding: 12px 16px;
    border-radius: 16px;
    max-width: 90%;
  }
`;

export const StyledThinkingBox = styled.div`
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.15);
  background: linear-gradient(
    135deg,
    rgba(238, 242, 255, 0.9) 0%,
    rgba(243, 232, 255, 0.7) 50%,
    rgba(252, 231, 243, 0.5) 100%
  );
  border: 1px solid rgba(99, 102, 241, 0.2);
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 0.4s ease-out;

  @media (prefers-color-scheme: dark) {
    background: linear-gradient(
      135deg,
      rgba(30, 27, 75, 0.4) 0%,
      rgba(88, 28, 135, 0.3) 50%,
      rgba(157, 23, 77, 0.2) 100%
    );
    border: 1px solid rgba(99, 102, 241, 0.3);
  }

  @media (max-width: 640px) {
    border-radius: 16px;
    margin-bottom: 12px;
  }
`;

export const StyledInputContainer = styled.div`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  border: 2px solid rgba(99, 102, 241, 0.3);
  box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: rgba(99, 102, 241, 0.6);
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.25);
  }

  @media (prefers-color-scheme: dark) {
    background: rgba(30, 41, 59, 0.9);
    border: 2px solid rgba(99, 102, 241, 0.4);
  }

  @media (max-width: 640px) {
    border-radius: 20px;
  }
`;

export const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 18px 24px;
  resize: none;
  background: transparent;
  border: none;
  color: #1f2937;
  font-size: 15px;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  &::placeholder {
    color: #9ca3af;
  }

  @media (prefers-color-scheme: dark) {
    color: #f1f5f9;

    &::placeholder {
      color: #64748b;
    }
  }

  @media (max-width: 640px) {
    padding: 14px 18px;
    font-size: 14px;
  }
`;

export const StyledButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  background: ${({ disabled }) =>
    disabled
      ? "#e5e7eb"
      : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"};
  color: ${({ disabled }) => (disabled ? "#9ca3af" : "#ffffff")};
  border: none;
  outline: none;

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  @media (prefers-color-scheme: dark) {
    background: ${({ disabled }) =>
      disabled
        ? "#374151"
        : "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"};
    color: ${({ disabled }) => (disabled ? "#6b7280" : "#ffffff")};
  }

  @media (max-width: 640px) {
    padding: 10px 20px;
    font-size: 13px;
    border-radius: 12px;
  }
`;

export const StyledShimmerEffect = styled.div`
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s infinite;
`;

export const StyledPulseEffect = styled.div`
  animation: ${pulse} 2s ease-in-out infinite;
`;

// ========== Animation Variants for Framer Motion ==========
export const animations = {
    messageSlide: {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    },
    thinkingBox: {
        hidden: { opacity: 0, y: -15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.35,
                ease: "easeOut",
            },
        },
    },
    fadeIn: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.3 },
        },
    },
    scaleUp: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
            },
        },
    },
};

// ========== Global Styles ==========
export const globalStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(99, 102, 241, 0.05);
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    transition: background 0.2s ease;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.5);
  }

  /* Dark mode scrollbar */
  @media (prefers-color-scheme: dark) {
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(99, 102, 241, 0.08);
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.4);
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(99, 102, 241, 0.6);
    }
  }

  /* Improved spacing for mobile */
  @media (max-width: 640px) {
    .prose p {
      margin-bottom: 0.875rem;
    }

    .prose ul,
    .prose ol {
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .prose li {
      margin-top: 0.5rem;
    }
  }

  /* Selection styles */
  ::selection {
    background-color: rgba(99, 102, 241, 0.2);
    color: inherit;
  }

  ::-moz-selection {
    background-color: rgba(99, 102, 241, 0.2);
    color: inherit;
  }
`;

// ========== Utility Functions ==========
export const getResponsiveValue = (mobile: number, desktop: number) => {
  return window.innerWidth < 640 ? mobile : desktop;
};

export const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};