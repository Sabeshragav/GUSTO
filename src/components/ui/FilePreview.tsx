import { Image, FileText } from 'lucide-react';

interface FilePreviewProps {
  type: string;
  name: string;
}

export function FilePreview({ type, name }: FilePreviewProps) {
  const isPdf = type === 'pdf' || name.endsWith('.pdf');
  const isImage = type === 'image' || name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp');
  const isCode = type === 'code' || name.endsWith('.tsx') || name.endsWith('.ts') || name.endsWith('.js') || name.endsWith('.css') || name.endsWith('.html') || name.endsWith('.json');
  
  if (isImage) {
     return (
        <div className="w-12 h-16 bg-white border border-gray-300 shadow-sm rounded-[2px] overflow-hidden flex flex-col items-center relative">
           <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Image size={24} className="text-gray-400" aria-label={name} />
           </div>
        </div>
     )
  }

  return (
    <div className="w-12 h-16 bg-white border border-gray-300 shadow-sm rounded-[2px] overflow-hidden flex flex-col relative">
      {/* Decorative lines to look like text */}
      <div className="mt-3 mx-2 space-y-1">
         <div className="h-0.5 bg-gray-200 w-3/4 rounded-full"></div>
         <div className="h-0.5 bg-gray-200 w-full rounded-full"></div>
         <div className="h-0.5 bg-gray-200 w-5/6 rounded-full"></div>
         <div className="h-0.5 bg-gray-200 w-full rounded-full"></div>
         <div className="h-0.5 bg-gray-200 w-2/3 rounded-full"></div>
      </div>

       {isCode && (
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gray-900 flex items-center justify-center">
             <span className="text-[8px] font-mono text-green-400">JS</span>
          </div>
       )}

      {/* PDF styling */}
      {isPdf && (
        <div className="absolute top-0 right-0 p-1">
           <div className="w-4 h-4 rounded-bl bg-red-500 text-[6px] text-white font-bold flex items-center justify-center">
              PDF
           </div>
        </div>
      )}
      
      {/* Type badge for generic files */}
      {!isPdf && !isCode && (
         <div className="absolute bottom-2 right-2 opacity-20">
            <FileText size={16} />
         </div>
      )}
    </div>
  );
}
