import { useAppDispatch, useAppSelector } from "@/state/redux";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChapterFormData, chapterSchema } from "@/lib/schemas";
import { addChapter, closeChapterModal, editChapter } from "@/state";
import { v4 as uuidV4 } from "uuid";
import { toast } from "sonner";
import CustomModal from "@/components/CustomMoedal";
import { X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomFormField } from "@/components/CustomFormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ChapterModel = () => {
  const dispatch = useAppDispatch();
  const {
    isChapterModalOpen,
    selectedSectionIndex,
    selectedChapterIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  const chapter: Chapter | undefined =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;

  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      video: "",
    },
  });

  useEffect(() => {
    if (chapter) {
      methods.reset({
        title: chapter.title,
        content: chapter.content,
        video: chapter.video || "",
      });
    } else {
      methods.reset({
        title: "",
        content: "",
        video: "",
      });
    }
  }, [chapter]);
  // },[chapter,methods]);

  const onClose = () => {
    dispatch(closeChapterModal());
  };

  const onSubmit = (data: ChapterFormData) => {
    if (selectedSectionIndex === null) return;
    const newChapter: Chapter = {
      chapterId: chapter?.chapterId || uuidV4(),
      title: data.title,
      content: data.content,
      type: data.video ? "Video" : "Text",
      video: data.video,
    };
    if (selectedChapterIndex === null) {
      dispatch(
        addChapter({ sectionIndex: selectedSectionIndex, chapter: newChapter })
      );
    } else {
      dispatch(
        editChapter({
          sectionIndex: selectedSectionIndex,
          chapterIndex: selectedChapterIndex,
          chapter: newChapter,
        })
      );
    }
    toast.success(
      "chapter added/updated successfully but you need to save the course"
    );
    onClose();
  };

  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="chapter-modal">
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">Add/Edit Chapter</h2>
          <button className="chapter-modal__close" onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CustomFormField
              name="title"
              type="text"
              label="Chapter Title"
              placeholder="Write Your Chapter Title Here "
            />
            <CustomFormField
              name="content"
              type="textarea"
              label="Chapter Content"
              placeholder="Write Your Chapter Content Here "
            />
            {/* video form filed  */}
            <FormField
              control={methods.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="text-customgreys-dirtyGrey text-sm">
                    Chapter Video
                  </FormLabel>
                  <FormControl>
                    <>
                      {typeof value === "string" && value && (
                        <div className="mb-2 text-sm text-customgreys-dirtyGrey">
                          CurrentVideo file:{value.split("/").pop()}
                        </div>
                      )}
                      {value instanceof File && (
                        <div className="mb-2 text-sm text-customgreys-dirtyGrey">
                          Selected file:{value.name}
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        className=" border-none bg-customgreys-darkGrey p-4"
                      />
                    </>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            ></FormField>
            <div className="chapter-modal__actions">
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

export default ChapterModel;
