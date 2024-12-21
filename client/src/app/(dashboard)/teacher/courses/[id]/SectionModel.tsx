import { useAppDispatch, useAppSelector } from "@/state/redux";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {  SectionFormData, sectionSchema } from "@/lib/schemas";
import {  addSection,  closeSectionModal,  editSection } from "@/state";
import { v4 as uuidV4 } from "uuid";
import { toast } from "sonner";
import CustomModal from "@/components/CustomMoedal";
import { X } from "lucide-react";
import {
  Form,
} from "@/components/ui/form";
import { CustomFormField } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";

const SectionModel = () => {
  const dispatch = useAppDispatch();
  const { isSectionModalOpen, selectedSectionIndex, sections } = useAppSelector(
    (state) => state.global.courseEditor
  );

  const section =
    selectedSectionIndex !== null ? sections[selectedSectionIndex] : null;

  const methods = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      description: ""
    },
  });

  useEffect(() => {
    if (section) {
      methods.reset({
        title: section.sectionTitle,
        description:section.sectionDescription,
      });
    } else {
      methods.reset({
        title: "",
        description: "",
 
      });
    }
  }, [section]);
  // },[section,methods]);

  const onClose = () => {
    dispatch(closeSectionModal());
  };

  const onSubmit = (data: SectionFormData) => {
    const newSection: Section = {
      sectionId: section?.sectionId || uuidV4(),
      sectionTitle: data.title,
      sectionDescription: data.description,
      chapters :section?.chapters||[],

    };
    if (selectedSectionIndex === null) {
      dispatch(
        dispatch(addSection(newSection))
      );
    } else {
      dispatch(
        editSection({
          index: selectedSectionIndex,
          section: newSection,
        })
      );
    }
    toast.success(
      "section added/updated successfully but you need to save the course"
    );
    onClose();
  };

  return (
    <CustomModal isOpen={isSectionModalOpen} onClose={onClose}>
      <div className="section-modal">
        <div className="section-modal__header">
          <h2 className="section-modal__title">Add/Edit Chapter</h2>
          <button className="section-modal__close" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="section-modal__form">
            <CustomFormField
              name="title"
              type="text"
              label="Section Title"
              placeholder="Write Your Section Title Here "
            />
            <CustomFormField
              name="description"
              type="textarea"
              label="Section Description"
              placeholder="Write Your Section Description Here "
            />

           
            <div className="section-modal__actions">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default SectionModel;
