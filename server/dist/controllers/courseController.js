"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourse = exports.listCourses = void 0;
const courseModel_1 = __importDefault(require("../models/courseModel"));
const uuid_1 = require("uuid");
const express_1 = require("@clerk/express");
const listCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query;
    try {
        const courses = category && category !== "all" ? yield courseModel_1.default.scan("category").eq(category).exec() : yield courseModel_1.default.scan().exec();
        res.json({ message: "success", data: courses });
    }
    catch (error) {
        res.status(500);
        res.json({ message: "error retrieving courses ", error });
    }
});
exports.listCourses = listCourses;
const getCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    try {
        const course = yield courseModel_1.default.get(courseId);
        if (!course) {
            res.status(404).json({ message: "not found" });
            return;
        }
        res.json({ message: "success", data: course });
    }
    catch (error) {
        res.status(500);
        res.json({ message: "error retrieving course ", error });
    }
});
exports.getCourse = getCourse;
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teacherId, teacherName } = req.body;
        if (!teacherId || !teacherName) {
            res.status(400).json({ message: "Teacher id and name are reaquired" });
            return;
        }
        const newCourse = new courseModel_1.default({
            courseId: (0, uuid_1.v4)(),
            teacherId,
            teacherName,
            title: "untitled",
            description: "",
            category: "unCategorized",
            image: "",
            price: 0,
            level: "Beginner",
            status: "Draft",
            sections: [],
            enrollments: [],
        });
        yield newCourse.save();
        res.json({ message: "created course successfully", data: newCourse });
    }
    catch (error) {
        res.status(500);
        res.json({ message: "error creating course   ", error });
    }
});
exports.createCourse = createCourse;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const updateData = Object.assign({}, req.body);
    const { userId } = (0, express_1.getAuth)(req);
    try {
        const course = yield courseModel_1.default.get(courseId);
        if (!course) {
            res.status(404).json({ message: "course not found" });
            return;
        }
        if (course.teacherId !== userId) {
            res.status(403).json({ message: "Not authorized to update" });
            return;
        }
        if (updateData.price) {
            const price = parseInt(updateData.price);
            if (isNaN(price)) {
                res.status(404).json({ message: "invalid price", error: "price must be number" });
                return;
            }
        }
        if (updateData.sections) {
            const sectionsData = typeof updateData.sections === "string" ? JSON.parse(updateData.sections) : updateData.sections;
            updateData.sections = sectionsData.map((section) => (Object.assign(Object.assign({}, section), { sectionId: section.sectionId || (0, uuid_1.v4)(), chapters: section.chapters.map((chapter) => (Object.assign(Object.assign({}, chapter), { chapterId: chapter.chapterId || (0, uuid_1.v4)() }))) })));
        }
        Object.assign(course, updateData);
        yield course.save();
        res.json({ message: "updated course successfully", data: course });
    }
    catch (error) {
        res.status(500);
        res.json({ message: "error updating course   ", error });
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId } = req.params;
    const { userId } = (0, express_1.getAuth)(req);
    try {
        const course = yield courseModel_1.default.get(courseId);
        if (!course) {
            res.status(404).json({ message: "course not found" });
            return;
        }
        if (course.teacherId !== userId) {
            res.status(403).json({ message: "Not authorized to update" });
            return;
        }
        yield courseModel_1.default.delete(courseId);
        res.json({ message: "deleted successfully" });
    }
    catch (error) {
        res.status(500);
        res.json({ message: "error deleting course ", error });
    }
});
exports.deleteCourse = deleteCourse;
