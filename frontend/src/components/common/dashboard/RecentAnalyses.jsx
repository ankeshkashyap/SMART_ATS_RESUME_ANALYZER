import { Eye } from "lucide-react";
export default function RecentAnalyses (){
    const analyses =[
        {
        name : "Ankesh",
        score:"90%",
        role:"ML engg.",
        date:"may 14",
    },

    {
        name : "Suraj",
        score:"85%",
        role:"Data scientist",
        date:"may 13",
    },
    {
        name : "Shubham",
        score:"72%",
        role:"Cloud Engg.",
        date:"May 13,2024",
    },
    {
        name : "Tyson",
        score:"20%",
        role:"Boxing",
        date:"11 may",
    }]

    function getScoreStyle(score) {
    const numericScore = parseInt(score);

    if (numericScore >= 80) {
        return "bg-green-50 text-green-700";
    }

    if (numericScore >= 65) {
        return "bg-orange-50 text-yellow-700";
    }

    return "bg-red-50 text-red-700";
}

    return (
        <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center p-6">
               
                 <h2 className="text-xl font-semibold text-gray-900">
                    Recent Analyses
                </h2>
                <button className="text-primary font-medium hover:underline">
                    View All
                </button>
             </div>  
             <div className="overflow-x-auto">
                <table className="w-full">
                <thead className="bg-gray-100">
                    <tr>
                       <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Resume Name</th> 
                       <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Match Score</th>
                       <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Job Role</th>
                       <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Analyzed on</th>
                       <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Action</th>
                    
                    </tr>
                </thead>

                <tbody>
                {analyses.map((analysis)=> (
                    <tr key={analysis.name}
                    className="border-t border-gray-500 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-700">{analysis.name}</td>
                        <td className="px-6 py-4">
                            <span
                                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getScoreStyle(analysis.score)}`}>
                                {analysis.score}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{analysis.role}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{analysis.date}</td>
                        <td className="px-6 py-4 text-right">
                            <button title="View analysis"
                            className="text-gray-500 hover:text-primary-transition">
                                <Eye size={20}/>
                            </button>
                        </td>
                    </tr>
                ))}

                </tbody>
                </table>
                </div>  
           
        </section>
    )
}