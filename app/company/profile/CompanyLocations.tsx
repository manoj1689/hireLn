"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanyLocations,
  createCompanyLocation,
  updateCompanyLocation,
  deleteCompanyLocation,
} from "@/lib/slices/company/company-location";
import { AppDispatch, RootState } from "@/lib/store";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";

export default function CompanyLocationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { locations } = useSelector((state: RootState) => state.companyLocation);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<any>({});
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getCompanyLocations());
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      email: "",
      phone: "",
      isHeadquarters: false,
    });
    setEditId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (loc: any) => {
    setForm(loc);
    setEditId(loc.id);
    setIsModalOpen(true);
  };

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (editId) {
      dispatch(updateCompanyLocation({ id: editId, data: form }));
    } else {
      dispatch(createCompanyLocation(form));
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this location?")) {
      dispatch(deleteCompanyLocation(id));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Manage Company Locations</h1>
          <p className="text-muted-foreground">Add, edit, or delete physical office locations</p>
        </div>
        <Button onClick={openAddModal}>+ Add Location</Button>
      </div>

      {/* Modal for Add/Edit */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        center
        classNames={{ modal: "rounded-lg p-4" }}
      >
        <h2 className="text-xl font-semibold mb-4">{editId ? "Edit Location" : "Add Location"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Name" value={form.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
          <Input placeholder="Address" value={form.address || ""} onChange={(e) => handleChange("address", e.target.value)} />
          <Input placeholder="City" value={form.city || ""} onChange={(e) => handleChange("city", e.target.value)} />
          <Input placeholder="State" value={form.state || ""} onChange={(e) => handleChange("state", e.target.value)} />
          <Input placeholder="Zip Code" value={form.zipCode || ""} onChange={(e) => handleChange("zipCode", e.target.value)} />
          <Input placeholder="Country" value={form.country || ""} onChange={(e) => handleChange("country", e.target.value)} />
          <Input placeholder="Email" value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} />
          <Input placeholder="Phone" value={form.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} />
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={form.isHeadquarters || false}
              onChange={(e) => handleChange("isHeadquarters", e.target.checked)}
            />
            <Label>Is Headquarters</Label>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
          </div>
        </div>
      </Modal>

      {/* List of Locations */}
      <div className="space-y-4">
        {locations.map((loc) => (
          <Card key={loc.id}>
            <CardContent className="p-4 flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold">{loc.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {loc.address}, {loc.city}, {loc.state}, {loc.zipCode}, {loc.country}
                </p>
                <p className="text-sm">{loc.email} | {loc.phone}</p>
                {loc.isHeadquarters && <span className="text-xs text-green-500">🏢 Headquarters</span>}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEditModal(loc)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(loc.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
