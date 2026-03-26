import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import schoolLogo from "@/assets/school-logo.jpeg";
import { GraduationCap, LogIn, BookOpen, Users } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type LoginRole = "parent" | "teacher" | null;
type LoginStep = "role" | "mobile" | "otp" | "select-child";

interface Student {
  id: string;
  register_number: string;
  student_name: string;
  class_name: string;
  father_name: string;
  mother_name: string;
  primary_mobile: string;
  secondary_mobile: string;
  active_whatsapp: string;
}

interface Teacher {
  id: string;
  name: string;
  mobile: string;
  class_assigned: string;
  subject: string;
}

const ParentLogin = () => {
  const [step, setStep] = useState<LoginStep>("role");
  const [role, setRole] = useState<LoginRole>(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole: LoginRole) => {
    setRole(selectedRole);
    setStep("mobile");
    setError("");
  };

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmed = mobileNumber.trim();
    if (!trimmed) {
      setError("Please enter a mobile number.");
      setLoading(false);
      return;
    }

    if (role === "parent") {
      // Search students by primary or secondary mobile
      const { data, error: fetchError } = await supabase
        .from("students")
        .select("*")
        .or(`primary_mobile.eq.${trimmed},secondary_mobile.eq.${trimmed}`);

      if (fetchError) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (!data || data.length === 0) {
        setError("No student found with this mobile number.");
        setLoading(false);
        return;
      }

      setStudents(data as Student[]);
    } else if (role === "teacher") {
      const { data, error: fetchError } = await supabase
        .from("teachers")
        .select("*")
        .eq("mobile", trimmed)
        .maybeSingle();

      if (fetchError) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (!data) {
        setError("No teacher found with this mobile number.");
        setLoading(false);
        return;
      }

      setTeacher(data as Teacher);
    }

    setStep("otp");
    setLoading(false);
  };

  const handleOtpVerify = () => {
    setError("");
    if (otp.length !== 4) {
      setError("Please enter the 4-digit OTP.");
      return;
    }

    // Simulated OTP - accept "1234" or any 4 digits for testing
    if (otp !== "1234") {
      setError("Invalid OTP. Use 1234 for testing.");
      return;
    }

    if (role === "teacher" && teacher) {
      sessionStorage.setItem("teacher_data", JSON.stringify(teacher));
      navigate("/teacher/dashboard");
      return;
    }

    if (role === "parent") {
      if (students.length === 1) {
        sessionStorage.setItem("student_data", JSON.stringify(students[0]));
        navigate("/parent/profile");
      } else {
        setStep("select-child");
      }
    }
  };

  const handleSelectChild = (student: Student) => {
    sessionStorage.setItem("student_data", JSON.stringify(student));
    navigate("/parent/profile");
  };

  const handleBack = () => {
    setError("");
    setOtp("");
    if (step === "otp") setStep("mobile");
    else if (step === "select-child") setStep("otp");
    else if (step === "mobile") {
      setStep("role");
      setRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-center">
            <img
              src={schoolLogo}
              alt="Dunne's Institute Logo"
              className="w-24 h-24 mx-auto border-4 border-white/30 shadow-lg object-contain mb-4 rounded-lg"
            />
            <h1 className="text-2xl font-bold text-white font-['Playfair_Display']">
              Dunne's Institute
            </h1>
            <p className="text-blue-200 text-sm mt-1">School Portal</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Step: Role Selection */}
            {step === "role" && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Welcome! Who are you?</h2>
                  <p className="text-sm text-gray-500 mt-1">Select your role to continue</p>
                </div>
                <Button
                  onClick={() => handleRoleSelect("parent")}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl flex items-center justify-center gap-3"
                >
                  <Users className="w-6 h-6" />
                  I'm a Parent
                </Button>
                <Button
                  onClick={() => handleRoleSelect("teacher")}
                  className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-xl flex items-center justify-center gap-3"
                >
                  <BookOpen className="w-6 h-6" />
                  I'm a Teacher
                </Button>
              </div>
            )}

            {/* Step: Mobile Number */}
            {step === "mobile" && (
              <form onSubmit={handleMobileSubmit} className="space-y-6">
                <div className="text-center mb-2">
                  <GraduationCap className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    {role === "parent" ? "Parent Login" : "Teacher Login"}
                  </h2>
                  <p className="text-sm text-gray-500">Enter your Registered Mobile Number</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="text-gray-700 font-medium">
                    Registered Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="h-12 text-lg border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                    autoFocus
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Searching...
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* Step: OTP Verification */}
            {step === "otp" && (
              <div className="space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">Verify OTP</h2>
                  <p className="text-sm text-gray-500">
                    Enter the 4-digit code sent to +91 {mobileNumber}
                  </p>
                  <p className="text-xs text-blue-500 mt-1">(Test OTP: 1234)</p>
                </div>

                <div className="flex justify-center">
                  <InputOTP maxLength={4} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 h-12 rounded-xl"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleOtpVerify}
                    className="flex-1 h-12 bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold rounded-xl"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Verify & Login
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Select Child (Sibling Support) */}
            {step === "select-child" && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <Users className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Select Your Child</h2>
                  <p className="text-sm text-gray-500">
                    Multiple students are linked to this number
                  </p>
                </div>

                <div className="space-y-3">
                  {students.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleSelectChild(student)}
                      className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <p className="font-semibold text-gray-900">{student.student_name}</p>
                      <p className="text-sm text-gray-500">
                        Class {student.class_name} • Reg: {student.register_number}
                      </p>
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="w-full h-12 rounded-xl"
                >
                  Back
                </Button>
              </div>
            )}

            <p className="text-xs text-center text-gray-400 mt-6">
              Contact the school office if your number is not registered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentLogin;
