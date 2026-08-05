import { useState } from "react";
import {Upload, X} from "lucide-react";

export default function UploadResume({onClose}){
    const [file,setFile]= useState(null);
    const [error, setError]=useState("")

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile){
            return;
        }

        const validationError = validateFile(selectedFile);

        if (validationError){
            setError(validationError)
            setFile(null);
            return;
        }

        setError("")
        setFile(selectedFile);
    };
    const handleDragOver = (e)=>{
        e.preventDefault();
    };

    const handleDrop = (e) =>{
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];

        if (!droppedFile){
            return;
        }

        const validationError = validateFile(droppedFile);

        if (validationError){
            setError(validationError)
            setFile(null);
            return;
        }

        setError("")
        setFile(droppedFile);
    };

    const validateFile = (selectedFile) =>{
        const allowedTypes =[
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        const maxSize =10*1024*1024;

        if (!allowedTypes.includes(selectedFile.type)){
            return "Only PDF or DOCX files are allowed"
        }
        if (selectedFile.size>maxSize){
            return "File size must be less than 10 MB."
        }

        return null;
    }
    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={onClose}>

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8"
                onClick={(e) => e.stopPropagation()}>

                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Upload Resume
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Upload your resume to begin the ATS analysis.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                    >
                        <X size={20} />
                    </button>

                </div>

            <input
            id="resume-upload"
            type="file"
            accept=".pdf,.docx"
            onChange={handleFile}
            className="hidden" />

            <label
                htmlFor="resume-upload"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-primary hover:bg-orange-50/30 transition">
                <Upload
                    size={40}
                    className="text-primary mb-4"
                />

                <p className="text-lg font-medium text-gray-900">
                    Drag & drop your resume here
                </p>

                <p className="text-sm text-gray-500 mt-2">
                    or click to browse files
                </p>

                <p className="text-xs text-gray-400 mt-4">
                    PDF or DOCX • Maximum 10 MB
                </p>
            </label>
            {error&&(
                <p className="mt-4 text-sm text-red-600">
                    {error}
                </p>
            )}

            {file && (
                <p>
                    Selected File : {file.name}
                </p>
            )}
        </div>
        </div>

    )
}