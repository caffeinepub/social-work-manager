import type { Volunteer } from "../backend";

type VolunteerWithId = Volunteer & { id: bigint };

interface Props {
  volunteer: VolunteerWithId;
  joinDate?: string;
  designation?: string;
  overrideName?: string;
  overridePhone?: string;
  overrideLocation?: string;
  overrideStatus?: boolean;
  fatherName?: string;
  photoUrl?: string;
}

function QrPlaceholder({ seed }: { seed: number }) {
  const SIZE = 10;
  const cells: { key: string; filled: boolean }[] = [];
  for (let i = 0; i < SIZE * SIZE; i++) {
    const r = Math.floor(i / SIZE);
    const c = i % SIZE;
    const v = ((seed * 1103515245 + i * 214013) ^ (i * 1664525 + seed)) >>> 0;
    const natural = v % 3 !== 0;
    const border = r === 0 || r === SIZE - 1 || c === 0 || c === SIZE - 1;
    const finderTL = r < 3 && c < 3;
    const finderTR = r < 3 && c >= SIZE - 3;
    const finderBL = r >= SIZE - 3 && c < 3;
    cells.push({
      key: `${r}-${c}`,
      filled: border || finderTL || finderTR || finderBL || natural,
    });
  }
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
        width: 72,
        height: 72,
        gap: 1,
        padding: 5,
        background: "white",
        border: "2px solid #1a3a5c",
        borderRadius: 4,
      }}
    >
      {cells.map(({ key, filled }) => (
        <div
          key={key}
          style={{
            background: filled ? "#1a3a5c" : "white",
            borderRadius: 0.5,
          }}
        />
      ))}
    </div>
  );
}

export default function VolunteerCard({
  volunteer,
  joinDate,
  overrideName,
  overridePhone,
  fatherName,
  photoUrl,
}: Props) {
  const volunteerId = `JMVVOL-${String(volunteer.id).padStart(3, "0")}`;
  const displayName = overrideName ?? volunteer.name;
  const displayPhone = overridePhone ?? volunteer.phone;
  const displayLocation = volunteer.location || "Margoobpur Deedaheri Haridwar";
  const initial = displayName.slice(0, 1).toUpperCase();
  const date = joinDate ?? new Date().toLocaleDateString("en-IN");
  const idNum = Number(volunteer.id);
  const isActive = volunteer.status !== false;

  return (
    <div
      id="volunteer-card-print"
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      {/* ===== FRONT SIDE ===== */}
      <div
        style={{
          width: 290,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 6px 28px rgba(0,0,0,0.35)",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          background:
            "linear-gradient(135deg, #1a3a5c 0%, #1e5570 40%, #1a7a6e 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          position: "relative",
          color: "#fff",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            bottom: -20,
            left: -20,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            display: "flex",
            padding: "18px 16px 14px",
            gap: 14,
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left: Avatar + badge + ID */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              flexShrink: 0,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "2.5px solid rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 900,
                color: "#fff",
                overflow: "hidden",
                backdropFilter: "blur(4px)",
              }}
            >
              {photoUrl ? (
                <img
                  src={photoUrl}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="Profile"
                />
              ) : (
                initial
              )}
            </div>
            {/* VOLUNTEER badge */}
            <div
              style={{
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: 4,
                padding: "2px 10px",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: 1.5,
                color: "#fff",
                textTransform: "uppercase",
              }}
            >
              VOLUNTEER
            </div>
            {/* ID */}
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              {volunteerId}
            </div>
          </div>

          {/* Right: Details */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.65)",
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              SOCIAL WORK MANAGER
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: "#fff",
                lineHeight: 1.2,
                marginBottom: 2,
              }}
            >
              {displayName}
            </div>
            {/* Phone */}
            {displayPhone && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 11,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <span style={{ fontSize: 12 }}>📞</span>
                {displayPhone}
              </div>
            )}
            {/* Location */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 5,
                fontSize: 10,
                color: "rgba(255,255,255,0.8)",
                lineHeight: 1.4,
              }}
            >
              <span style={{ fontSize: 11, marginTop: 1 }}>📍</span>
              <span>{displayLocation} Uttarakhand Pine Code 247667</span>
            </div>
            {/* Joined */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              <span style={{ fontSize: 11 }}>📅</span>
              Joined: {date}
            </div>
            {/* Active badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: isActive ? "#22c55e" : "rgba(255,255,255,0.2)",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 1,
                color: "#fff",
                width: "fit-content",
                marginTop: 2,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "inline-block",
                }}
              />
              {isActive ? "ACTIVE" : "INACTIVE"}
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            background: "rgba(0,0,0,0.2)",
            padding: "6px 16px",
            fontSize: 9,
            color: "rgba(255,255,255,0.6)",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          Margupur, Dahedi, Haridwar, Uttarakhand
        </div>
      </div>

      {/* ===== SEPARATOR ===== */}
      <div
        style={{
          textAlign: "center",
          fontSize: 9,
          color: "#aaa",
          letterSpacing: 2,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div style={{ flex: 1, height: 1, background: "#ddd" }} />
        BACK
        <div style={{ flex: 1, height: 1, background: "#ddd" }} />
      </div>

      {/* ===== BACK SIDE ===== */}
      <div
        style={{
          width: 290,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 6px 28px rgba(0,0,0,0.2)",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          background: "#fff",
          border: "1px solid #e0e0e0",
        }}
      >
        {/* Top accent */}
        <div
          style={{
            height: 6,
            background: "linear-gradient(90deg, #1a3a5c 0%, #1a7a6e 100%)",
          }}
        />

        <div style={{ padding: "14px 16px 10px" }}>
          {(
            [
              ["Name", displayName],
              ["Father Name", fatherName || "—"],
              ["Address", `${displayLocation}, Uttarakhand (U.K.)`],
              ["Mobile No.", displayPhone || "—"],
            ] as [string, string][]
          ).map(([label, value]) => (
            <div
              key={label}
              style={{ fontSize: 11, color: "#222", lineHeight: 1.9 }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "#1a3a5c",
                  minWidth: 90,
                  display: "inline-block",
                }}
              >
                {label}:
              </span>
              {value}
            </div>
          ))}
        </div>

        <div style={{ height: 1, background: "#e8e8e8", margin: "0 16px" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "12px 0 10px",
          }}
        >
          <QrPlaceholder seed={idNum} />
        </div>

        <div style={{ height: 1, background: "#e8e8e8", margin: "0 16px" }} />

        <div
          style={{
            background: "linear-gradient(90deg, #eef4fb 0%, #e8f5f3 100%)",
            borderTop: "1px solid #d0dde8",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1a3a5c 0%, #1a7a6e 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#fff",
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            J
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#1a3a5c" }}>
              Jamiat Model Village
            </div>
            <div style={{ fontSize: 8, color: "#4a6a8c" }}>
              Margupur Mustafabad, Haridwar-247667 (U.K.)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
