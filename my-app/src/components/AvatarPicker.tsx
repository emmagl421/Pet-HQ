import PetAvatar from "./PetAvatar";
import { 
    COATS, PATTERNS, EYES,
    type CatAvatar, type CoatId, type PatternId, type EyeId,
} from "../lib/catAvatar";

type AvatarPickerProps = {
    value: CatAvatar;
    onChange: (next: CatAvatar) => void;
};

export default function AvatarPicker({ value, onChange }: AvatarPickerProps) {
  return (
    <div className="d-flex gap-3 align-items-center">
      <PetAvatar avatar={value} size={128} label="Preview of your pet's avatar" />

      <div className="flex-grow-1">
        <label className="form-label" htmlFor="avatar-coat">Coat color</label>
        <select
          id="avatar-coat"
          className="form-select mb-2"
          value={value.coat}
          onChange={(e) => onChange({ ...value, coat: e.target.value as CoatId })}
        >
          {(Object.keys(COATS) as CoatId[]).map((id) => (
            <option key={id} value={id}>{COATS[id].label}</option>
          ))}
        </select>

        <label className="form-label" htmlFor="avatar-pattern">Pattern</label>
        <select
          id="avatar-pattern"
          className="form-select mb-2"
          value={value.pattern}
          onChange={(e) => onChange({ ...value, pattern: e.target.value as PatternId })}
        >
          {(Object.keys(PATTERNS) as PatternId[]).map((id) => (
            <option key={id} value={id}>{PATTERNS[id].label}</option>
          ))}
        </select>

        <label className="form-label" htmlFor="avatar-eyes">Eye color</label>
        <select
          id="avatar-eyes"
          className="form-select"
          value={value.eyes}
          onChange={(e) => onChange({ ...value, eyes: e.target.value as EyeId })}
        >
          {(Object.keys(EYES) as EyeId[]).map((id) => (
            <option key={id} value={id}>{EYES[id].label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}