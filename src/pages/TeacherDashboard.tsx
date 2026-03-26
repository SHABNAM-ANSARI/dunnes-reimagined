import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import schoolLogo from "@/assets/school-logo.jpeg";
import { ArrowLeft, Megaphone, BookOpen, ClipboardCheck, Send, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Teacher {
  id: string;
  name: string;
  mobile: string;
  class_assigned: string;
  subject: string;
}

interface Student {
  id: string;
  student_name: string;
  register_number: string;
  class_name: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  class_name: string;
  teacher_name: string;
  created_at: string;
}

interface AttendanceRecord {
  student_id: string;
  status: string;
}

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  // Announcement form
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annType, setAnnType] = useState<string>("daily");
  const [annClass, setAnnClass] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("teacher_data");
    if (!stored) {
      navigate("/parent");
      return;
    }
    const data = JSON.parse(stored) as Teacher;
    setTeacher(data);

    // Get assigned classes
    const classes = data.class_assigned.split(",").map(c => c.trim()).filter(Boolean);
    setAvailableClasses(classes);
    if (classes.length > 0) {
      setSelectedClass(classes[0]);
      setAnnClass(classes[0]);
    }

    fetchAnnouncements(data.mobile);
  }, [navigate]);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    }
  }, [selectedClass]);

  const fetchStudents = async (className: string) => {
    const { data } = await supabase
      .from("students")
      .select("id, student_name, register_number, class_name")
      .eq("class_name", className)
      .order("student_name");
    
    if (data) {
      setStudents(data);
      // Initialize attendance
      const initial: Record<string, string> = {};
      data.forEach(s => { initial[s.id] = "present"; });
      setAttendance(initial);
    }
  };

  const fetchAnnouncements = async (mobile: string) => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("teacher_mobile", mobile)
      .order("created_at", { ascending: false })
      .limit(20);
    
    if (data) setAnnouncements(data as Announcement[]);
  };

  const handlePostAnnouncement = async () => {
    if (!teacher || !annTitle.trim() || !annContent.trim()) {
      toast.error("Please fill in title and content.");
      return;
    }
    setSaving(true);

    const { error } = await supabase.from("announcements").insert({
      teacher_mobile: teacher.mobile,
      teacher_name: teacher.name,
      title: annTitle.trim(),
      content: annContent.trim(),
      type: annType as any,
      class_name: annClass || selectedClass,
    });

    if (error) {
      toast.error("Failed to post announcement.");
    } else {
      toast.success("Announcement posted!");
      setAnnTitle("");
      setAnnContent("");
      fetchAnnouncements(teacher.mobile);
    }
    setSaving(false);
  };

  const handleSaveAttendance = async () => {
    if (!teacher) return;
    setSaving(true);

    const today = new Date().toISOString().split("T")[0];
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      student_id: studentId,
      date: today,
      status,
      marked_by: teacher.mobile,
    }));

    // Upsert attendance
    const { error } = await supabase
      .from("attendance")
      .upsert(records, { onConflict: "student_id,date" });

    if (error) {
      toast.error("Failed to save attendance.");
    } else {
      toast.success(`Attendance saved for ${records.length} students!`);
    }
    setSaving(false);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: prev[studentId] === "present" ? "absent" : prev[studentId] === "absent" ? "late" : "present",
    }));
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={schoolLogo} alt="Logo" className="w-12 h-12 object-contain rounded-lg border-2 border-white/30" />
            <div>
              <h1 className="text-lg font-bold font-['Playfair_Display']">Teacher Dashboard</h1>
              <p className="text-emerald-200 text-sm">{teacher.name} • {teacher.subject}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              sessionStorage.removeItem("teacher_data");
              navigate("/parent");
            }}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Logout
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" /> Announcements
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" /> Attendance
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> History
            </TabsTrigger>
          </TabsList>

          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-emerald-600" />
                  Post an Announcement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={annType} onValueChange={setAnnType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Announcement</SelectItem>
                        <SelectItem value="subject_update">Subject Update</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={annClass} onValueChange={setAnnClass}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableClasses.map(c => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={annTitle}
                    onChange={e => setAnnTitle(e.target.value)}
                    placeholder="Announcement title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea
                    value={annContent}
                    onChange={e => setAnnContent(e.target.value)}
                    placeholder="Write your announcement..."
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handlePostAnnouncement}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Send className="w-4 h-4 mr-2" /> Post Announcement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-blue-600" />
                    Mark Attendance — {format(new Date(), "dd MMM yyyy")}
                  </CardTitle>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableClasses.map(c => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No students found for this class.</p>
                ) : (
                  <>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {students.map((student, idx) => (
                        <div
                          key={student.id}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            attendance[student.id] === "present"
                              ? "border-green-300 bg-green-50"
                              : attendance[student.id] === "absent"
                              ? "border-red-300 bg-red-50"
                              : "border-yellow-300 bg-yellow-50"
                          }`}
                          onClick={() => toggleAttendance(student.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-mono text-gray-400 w-6">{idx + 1}</span>
                            <div>
                              <p className="font-medium text-gray-800">{student.student_name}</p>
                              <p className="text-xs text-gray-500">Reg: {student.register_number}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {attendance[student.id] === "present" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {attendance[student.id] === "absent" && <XCircle className="w-5 h-5 text-red-600" />}
                            {attendance[student.id] === "late" && <Clock className="w-5 h-5 text-yellow-600" />}
                            <span className="text-sm font-medium capitalize">{attendance[student.id]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span className="text-green-600">
                          Present: {Object.values(attendance).filter(s => s === "present").length}
                        </span>
                        <span className="text-red-600">
                          Absent: {Object.values(attendance).filter(s => s === "absent").length}
                        </span>
                        <span className="text-yellow-600">
                          Late: {Object.values(attendance).filter(s => s === "late").length}
                        </span>
                      </div>
                      <Button
                        onClick={handleSaveAttendance}
                        disabled={saving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Save Attendance
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No announcements yet.</p>
                ) : (
                  <div className="space-y-3">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-4 rounded-xl border bg-gray-50">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800">{ann.title}</h3>
                          <Badge variant="outline" className="text-xs capitalize">
                            {ann.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{ann.content}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>Class {ann.class_name}</span>
                          <span>{format(new Date(ann.created_at), "dd MMM yyyy, hh:mm a")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;
