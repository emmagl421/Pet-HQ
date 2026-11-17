import body from "../assets/sprites/cat/Body.png";
import eye_details from "../assets/sprites/cat/Eye_details.png";
import face_details from "../assets/sprites/cat/Face_details.png";
import ears from "../assets/sprites/cat/Ears.png";
import outline from "../assets/sprites/cat/Outline.png";

import tabby from "../assets/sprites/cat/Pattern_tabby.png";
import calico_dark from "../assets/sprites/cat/Pattern_calico_dark.png";
import calico_orange from "../assets/sprites/cat/Pattern_calico_orange.png";
import harlequin from "../assets/sprites/cat/Pattern_harlequin.png";
import mink from "../assets/sprites/cat/Pattern_mink.png";
import siamese from "../assets/sprites/cat/Pattern_siamese.png";
import turtoiseshell_dark from "../assets/sprites/cat/Pattern_turtoiseshell_dark.png";
import turtoiseshell from "../assets/sprites/cat/Pattern_turtoiseshell.png";

//Choices 
export type CoatId = "orange" | "gray" | "brown" | "cream" | "black" | "white";
export type PatternId = "tabby" | "calico" | "harlequin" | "mink" | "siamese" | "solid" | "turtoiseshell";
export type EyeId = "green" | "blue" | "amber" | "copper";

//What gets saved in the database
export type CatAvatar = {
    coat: CoatId;
    pattern: PatternId;
    eyes: EyeId;
};

export const DEFAULT_AVATAR: CatAvatar = { coat: "orange", pattern: "tabby", eyes: "green"};

type Coat = { label: string; base: string; markings: string };

export const COATS: Record<CoatId, Coat> = {
    orange: { label: "Orange", base: "#F2A65A", markings: "#C8742E"},
    gray: { label: "Gray", base: "#ABABAB", markings: "#5E5E5E"},
    brown: { label: "Brown", base: "#A0785A", markings: "#5C3D2E"},
    cream: { label: "Cream", base: "#F3E6D3", markings: "#C9A27E"},
    black: { label: "Black", base: "#2E2B2A", markings: "#1A1817"},
    white: { label: "White", base: "#FFFFFF", markings: "#C8C8C8"}
};

//Pattern layers are tinted with coats markingor fixed color
type PatternLayer = { src: string; color: "markings" | string };
type Pattern = { label: string; layers: PatternLayer[] };

export const PATTERNS: Record<PatternId, Pattern> = {
    solid: {label: "Solid", layers: [] },
    tabby: {label: "Tabby", layers: [{ src: tabby, color: "markings" }] },
    calico: {label: "Calico", layers: [{ src: calico_orange, color: "#E8913A" }, { src: calico_dark, color: "#3A3330"}]},
    harlequin: {label: "Harlequin", layers: [{ src: harlequin, color: "markings" }] },
    mink: {label: "Mink", layers: [{ src: mink, color: "markings" }] },
    siamese: {label: "Siamese", layers: [{ src: siamese, color: "markings" }] },
    turtoiseshell: {label: "Turtoiseshell", layers: [{ src:turtoiseshell_dark, color: "#5C3D2E" }, { src: turtoiseshell, color: "#C8742E"}] },
};

export const EYES: Record<EyeId, { label: string; color: string }> = {
    green: { label: "Green", color: "#6BAF5B" },
    blue: { label: "Blue", color: "#5B9BD5" },
    amber: { label: "Amber", color: "#E0A030" },
    copper: { label: "Copper", color: "#B8652E" }
};


//Turn avatars into layers (bottom to top)
//If color: null -> don't tint
export type Layer = { src: string; color: string | null };

export function buildLayers(avatar: CatAvatar): Layer[] {
    //?? is a fallback and protects bad data saved in the database
    const coat = COATS[avatar.coat] ?? COATS.orange;
    const pattern = PATTERNS[avatar.pattern] ?? PATTERNS.solid;
    const eyes = EYES[avatar.eyes] ?? EYES.green;

    return [
        { src: body, color: coat.base },
        { src: ears, color: coat.base},
        ...pattern.layers.map((layer) => ({
            src: layer.src,
            color: layer.color === "markings" ? coat.markings : layer.color
        })),
        { src: eye_details, color: eyes.color },
        { src: face_details, color: null },
        { src: outline, color: null}
    ];
}