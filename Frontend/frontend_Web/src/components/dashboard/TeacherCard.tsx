type TeacherCardProps = {
  name: string;
};

export default function TeacherCard({ name }: TeacherCardProps) {
  return (
    <div className="group relative bg-white p-5 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out border border-gray-200/50 hover:border-indigo-200 overflow-hidden">
      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50 opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -translate-y-6 translate-x-6 opacity-30 group-hover:opacity-50 transition-opacity" />
      <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full translate-y-4 -translate-x-4 opacity-25 group-hover:opacity-40 transition-opacity" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Avatar placeholder */}
        <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <span className="text-white text-lg font-bold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Name */}
        <h2 className="text-lg font-bold text-gray-800 text-center mb-1 group-hover:text-indigo-700 transition-colors duration-200">
          {name}
        </h2>
        
        {/* Subtitle */}
        <p className="text-sm text-gray-500 text-center font-medium">
          Profesor
        </p>
        
        {/* Bottom accent line */}
        <div className="mt-4 h-1 w-8 mx-auto bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-60 group-hover:w-12 group-hover:opacity-100 transition-all duration-300" />
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
    </div>
  );
}