# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run preview` - Preview production build locally

## Project Architecture

This is a React + TypeScript 3D visualization proof-of-concept built with Three.js via React Three Fiber. The application renders an interactive 3D scene with draggable, rotatable elements and complex geometry with custom textures.

### Core 3D Components

**Main Scene (`App.tsx`):**
- Sets up Canvas with OrbitControls (pan/zoom enabled, rotate disabled)
- Manages main 3D scene with shadow-casting lights and ground plane
- Coordinates between DraggableRotating wrapper and MultiColorFloor geometry

**DraggableRotating (`src/components/draggable-rotating/`):**
- Wrapper component providing pointer-based rotation controls
- Handles both auto-rotation and manual drag interaction
- Uses Three.js Group refs and useFrame for smooth animations

**MultiColorFloor (`src/components/multi-color-floor/`):**
- Complex geometric component creating curved/extruded floor shapes
- Generates custom ExtrudeGeometry with bezier curves for rounded edges
- Implements sophisticated UV mapping for texture application across faces
- Creates dynamic canvas-based textures with segmented color patterns
- Supports different curve orientations (front/back/left/right)

### Key Technical Details

**3D Rendering Stack:**
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Utility components (OrbitControls, Edges, etc.)
- Custom geometry creation with ExtrudeGeometry and Shape
- Canvas-based texture generation for multi-colored floor patterns

**Lighting System (`lights.tsx`):**
- Ambient light for base illumination
- Directional light with shadow casting
- Additional texture overlay via SpotLightWithTexture component

**Path Aliases:**
- `@/*` maps to `src/*` (configured in tsconfig.json)

## Asset Management

Static assets are served from `/public/`:
- `cathay_landmark.png` - Building texture overlay
- `New_Lin_Yuan.svg` - Logo/icon asset

## Development Notes

This project uses PNPM for package management. The codebase includes complex 3D mathematics for curved geometry generation and UV texture mapping, particularly in the MultiColorFloor component's ExtrudeGeometry creation and face-specific texture application.