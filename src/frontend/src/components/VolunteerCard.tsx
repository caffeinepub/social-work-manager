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
}

export default function VolunteerCard({
  volunteer,
  joinDate,
  designation,
  overrideName,
  overridePhone,
  overrideLocation,
  overrideStatus,
}: Props) {
  const volunteerId = `VOL-${String(volunteer.id).padStart(4, "0")}`;
  const displayName = overrideName ?? volunteer.name;
  const displayPhone = overridePhone ?? volunteer.phone;
  const displayLocation = overrideLocation ?? volunteer.location;
  const displayStatus = overrideStatus ?? volunteer.status;
  const initial = displayName.slice(0, 1).toUpperCase();
  const date = joinDate ?? new Date().toLocaleDateString("en-IN");

  return (
    <div
      id="volunteer-card-print"
      style={{
        width: 350,
        minHeight: 200,
        borderRadius: 16,
        background:
          "linear-gradient(135deg, #0f2d5c 0%, #1a5276 45%, #148f77 100%)",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{ display: "flex", padding: "20px 20px 12px", gap: 16, flex: 1 }}
      >
        {/* Left */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              border: "2.5px solid rgba(255,255,255,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {initial}
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1.2,
              color: "#a8d8ea",
            }}
          >
            VOLUNTEER
          </div>
          {designation && (
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: 0.8,
                color: "rgba(255,255,255,0.8)",
                textAlign: "center",
                maxWidth: 80,
                wordBreak: "break-word",
              }}
            >
              {designation}
            </div>
          )}
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.65)",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            {volunteerId}
          </div>
        </div>

        {/* Right */}
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
        >
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.55)",
              fontWeight: 600,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Social Work Manager
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.2,
            }}
          >
            {displayName}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              marginTop: 4,
            }}
          >
            {displayPhone && (
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.75)",
                  display: "flex",
                  gap: 6,
                }}
              >
                <span>📞</span>
                <span>{displayPhone}</span>
              </div>
            )}
            {displayLocation && (
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.75)",
                  display: "flex",
                  gap: 6,
                }}
              >
                <span>📍</span>
                <span>{displayLocation}</span>
              </div>
            )}
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.75)",
                display: "flex",
                gap: 6,
              }}
            >
              <span>📅</span>
              <span>Joined: {date}</span>
            </div>
          </div>

          <div style={{ marginTop: "auto" }}>
            <span
              style={{
                display: "inline-block",
                background: displayStatus
                  ? "rgba(46,213,115,0.25)"
                  : "rgba(255,71,87,0.25)",
                border: `1px solid ${
                  displayStatus ? "rgba(46,213,115,0.5)" : "rgba(255,71,87,0.5)"
                }`,
                borderRadius: 4,
                padding: "2px 8px",
                fontSize: 10,
                fontWeight: 700,
                color: displayStatus ? "#2ed573" : "#ff4757",
                letterSpacing: 0.8,
              }}
            >
              {displayStatus ? "● ACTIVE" : "● INACTIVE"}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        style={{
          background: "rgba(0,0,0,0.25)",
          padding: "7px 20px",
          fontSize: 9.5,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: 0.6,
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        Margupur, Dahedi, Haridwar, Uttarakhand
      </div>
    </div>
  );
}
