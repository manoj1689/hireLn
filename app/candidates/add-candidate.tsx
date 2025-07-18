import { useState } from "react";
import { useDispatch } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError, useForm } from "react-hook-form";
import ReactSelect, { MultiValue } from "react-select";
import { addCandidate } from "@/lib/slices/candidate/candidate-slice"; // Import the addCandidate action
import { AppDispatch } from "@/lib/store";

interface AddCandidateModalProps {
  showAddCandidateDialog: boolean; // Type for the dialog visibility
  setShowAddCandidateDialog: React.Dispatch<React.SetStateAction<boolean>>; // Type for the setter function
}



const AddCandidateModal = ({ showAddCandidateDialog, setShowAddCandidateDialog }: AddCandidateModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Validation for fields
  const validateForm = (data: any) => {
    let isValid = true;
    const validationErrors: any = {};

    if (!data.name) {
      validationErrors.name = "Full Name is required";
      isValid = false;
    }

    if (!data.email) {
      validationErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      validationErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!data.phone) {
      validationErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!data.resume) {
      validationErrors.resume = "Resume URL is required";
      isValid = false;
    }

    if (!data.skills || data.skills.length === 0) {
      validationErrors.skills = "At least one skill is required";
      isValid = false;
    }

    if (!data.experience) {
      validationErrors.experience = "Experience is required";
      isValid = false;
    }

    if (!data.education) {
      validationErrors.education = "Education is required";
      isValid = false;
    }

    if (!data.location) {
      validationErrors.location = "Location is required";
      isValid = false;
    }

    if (!data.salaryExpectation) {
      validationErrors.salaryExpectation = "Salary expectation is required";
      isValid = false;
    } else if (data.salaryExpectation <= 0) {
      validationErrors.salaryExpectation = "Salary must be a positive number";
      isValid = false;
    }

    // Set validation errors if any
    setValue('errors', validationErrors);

    return isValid;
  };

  const onSubmit = async (data: any) => {
    const isValid = validateForm({ ...data, skills });

    if (!isValid) {
      alert("Please fix the errors in the form.");
      return;
    }

    // Create the payload according to the CandidateBase structure
    const payload = {
      ...data,
      skills: skills, // Extract values from selected options
      salaryExpectation: parseInt(data.salaryExpectation),  // Ensure it's a number
    };

    console.log("Payload of candidate ", payload);

    try {
      const response = await dispatch(addCandidate(payload));

      if (response.meta.requestStatus === 'fulfilled') {
        alert("Candidate added successfully!");
        setShowAddCandidateDialog(false);
      }
    } catch (error) {
      alert("Error adding candidate");
    }
  };

  return (
    <Dialog open={showAddCandidateDialog} onOpenChange={setShowAddCandidateDialog}>
      <DialogContent className="sm:max-w-[900px] overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Candidate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} placeholder="Enter Name" />
              {errors.name && (
                <p className="text-red-500 text-xs">{(errors.name as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="Enter Email" />
              {errors.email && (
                <p className="text-red-500 text-xs">{(errors.email as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} placeholder="Enter Phone" />
              {errors.phone && (
                <p className="text-red-500 text-xs">{(errors.phone as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Resume URL</Label>
              <Input id="resume" {...register("resume")} placeholder="Enter Resume URL" />
              {errors.resume && (
                <p className="text-red-500 text-xs">{(errors.resume as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input id="portfolio" {...register("portfolio")} placeholder="Enter Portfolio URL" />
              {errors.portfolio && (
                <p className="text-red-500 text-xs">{(errors.portfolio as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input id="linkedin" {...register("linkedin")} placeholder="Enter LinkedIn URL" />
              {errors.linkedin && (
                <p className="text-red-500 text-xs">{(errors.linkedin as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" {...register("github")} placeholder="Enter GitHub URL" />
              {errors.github && (
                <p className="text-red-500 text-xs">{(errors.github as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="skills">Skills</Label>
              <div className="flex gap-2">
                <Input
                  id="skillInput"
                  placeholder="Enter a skill"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (skillInput.trim() !== "") {
                      setSkills((prev) => [...prev, skillInput.trim()]);
                      setSkillInput("");
                    }
                  }}
                >
                  + Add
                </Button>
              </div>
              {errors.skills && (
                <p className="text-red-500 text-xs">{(errors.skills as FieldError)?.message || "This field is required"}</p>
              )}
              {skills.length > 0 && (
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  {skills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              )}
            </div>


            <div className="space-y-2">
              <Label htmlFor="experience">Experience</Label>
              <Input id="experience" {...register("experience")} placeholder="Enter Experience" />
              {errors.experience && (
                <p className="text-red-500 text-xs">{(errors.experience as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="education">Education</Label>
              <Input id="education" {...register("education")} placeholder="Enter Education" />
              {errors.education && (
                <p className="text-red-500 text-xs">{(errors.education as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" {...register("location")} placeholder="Enter Location" />
              {errors.location && (
                <p className="text-red-500 text-xs">{(errors.location as FieldError)?.message || "This field is required"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="salaryExpectation">Salary Expectation</Label>
              <Input id="salaryExpectation" type="number" {...register("salaryExpectation")} placeholder="Enter Salary Expectation" />
              {errors.salaryExpectation && (
                <p className="text-red-500 text-xs">{(errors.salaryExpectation as FieldError)?.message || "This field is required"}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCandidateDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Candidate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCandidateModal;
