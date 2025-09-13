import HeaderCourse from "@/components/course/HeaderCourse";
import TableCourse from "@/components/course/TableCourse";
import SearchBar from "@/components/dashboard/SearchBar";

export default function CoursePage() {
  return (
    <>

      {/* Main content */}
      <div className="flex-1 p-6">
        <HeaderCourse />
        <div className="my-6">
                  <SearchBar/>
        </div>
        <div className="my-6">
          <TableCourse/>
        </div>
      </div>
    </>
        );
}