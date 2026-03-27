import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";
import { motion } from "motion/react";
import { useListVolunteers } from "../hooks/useQueries";

export default function MapPage() {
  const { data: volunteers } = useListVolunteers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 h-full"
    >
      <div
        className="grid grid-cols-1 xl:grid-cols-3 gap-5"
        style={{ minHeight: "500px" }}
      >
        {/* Map */}
        <Card className="shadow-card border-0 xl:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              Field Map — मरगुपुर, दहेड़ी, हरिद्वार, उत्तराखंड
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-0">
            <div
              className="rounded-xl overflow-hidden border border-border"
              style={{ height: "460px" }}
            >
              <iframe
                title="Field Map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.965091,29.853557,77.985091,29.873557&layer=mapnik&marker=29.863557,77.975091"
                style={{ width: "100%", height: "100%", border: "none" }}
                loading="lazy"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Location Panel */}
        <Card className="shadow-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users size={16} className="text-primary" />
              Volunteers
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!volunteers || volunteers.length === 0 ? (
              <div
                data-ocid="map.volunteers.empty_state"
                className="text-center py-10 text-muted-foreground"
              >
                <Users size={36} className="mx-auto mb-3 opacity-25" />
                <p className="text-sm">No volunteers listed</p>
              </div>
            ) : (
              <div
                data-ocid="map.volunteers.list"
                className="space-y-2 max-h-96 overflow-y-auto pr-1"
              >
                {volunteers.map((v, i) => (
                  <div
                    key={String(v.id)}
                    data-ocid={`map.volunteers.item.${i + 1}`}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">
                        {v.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {v.name}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin
                          size={10}
                          className="text-muted-foreground flex-shrink-0"
                        />
                        <p className="text-xs text-muted-foreground truncate">
                          {v.location || "Location not set"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        v.status
                          ? "bg-success/15 text-success border-success/20 text-xs"
                          : "bg-muted text-muted-foreground text-xs"
                      }
                    >
                      {v.status ? "Active" : "Off"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
