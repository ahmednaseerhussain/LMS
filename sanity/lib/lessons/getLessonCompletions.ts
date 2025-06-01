import { defineQuery } from "groq";
import { sanityFetch } from "../live";


interface Lesson {
  _id: string;
  title: string;
}

interface Module {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Course {
  _id: string;
  title: string;
  modules: Module[];
}

interface Completion {
  lesson: Lesson;
  module: Module;
}

export async function getLessonCompletions(
  studentId: string,
  courseId: string
) {
  const getCompletionsQuery = defineQuery(`{
    "completedLessons": *[_type == "lessonCompletion" && student._ref == $studentId && course._ref == $courseId] {
      ...,
      "lesson": lesson->{...},
      "module": module->{...}
    },
    "course": *[_type == "course" && _id == $courseId][0] {
      ...,
      "modules": modules[]-> {
        ...,
        "lessons": lessons[]-> {...}
      }
    }
  }`);

  const result = await sanityFetch({
    query: getCompletionsQuery,
    params: { studentId, courseId },
  });

  const course: Course = result.data.course;
  const completedLessons: Completion[] = result.data.completedLessons;

  const moduleProgress = course?.modules?.map((module: Module) => {
    const totalLessons = module.lessons?.length || 0;
    const completedInModule = completedLessons.filter(
      (completion: Completion) => completion.module?._id === module._id
    ).length;

    return {
      moduleId: module._id,
      title: module.title,
      progress: totalLessons > 0 ? (completedInModule / totalLessons) * 100 : 0,
      completedLessons: completedInModule,
      totalLessons,
    };
  });

  const totalLessons = course?.modules?.reduce(
    (acc: number, module: Module) => acc + (module?.lessons?.length || 0),
    0
  ) || 0;

  const totalCompleted = completedLessons?.length || 0;
  const courseProgress =
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;

  return {
    completedLessons: completedLessons || [],
    moduleProgress: moduleProgress || [],
    courseProgress,
  };
}
