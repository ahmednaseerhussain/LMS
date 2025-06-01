// types/course.ts

export interface Lesson {
  _id: string;
  title: string;
  content?: string; // Optional field, depending on your schema
}

export interface Module {
  _id: string;
  title: string;
  lessons?: Lesson[];
}

export interface Instructor {
  name: string;
  photo?: string; // You can replace `any` with the correct image type if using Sanity types
  bio?: string;
}

// ...existing code...
export interface Category {
  _id: string;
  _type: "category";
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  name?: string;
  slug?: { current: string };
  description?: string;
  icon?: string;
  color?: string;
}
// ...existing code...

// ...existing code...
// ...existing code...
export interface Course {
  _id: string;
  _type: "course"; // Make required
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  title?: string;
  description?: string;
  price?: number;
  image?: string;
  modules?: Module[];
  instructor?: Instructor | null;
  category?: Category | null;
  slug: string | null; // Make required and match type
}
// ...existing code...
