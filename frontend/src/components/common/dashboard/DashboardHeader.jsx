
export default function DashboadHeader({user , onUploadClick}){
    return(
        <section className="flex flex-col sm:flex-row  sm:justify-between sm:items-center gap-4">
            <div>
            <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
                Welcome back, {user?.name}
            </p>
            </div>
            <button 
            onClick={onUploadClick}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg transition font-semibold">
                Upload New Resume 
            </button>
        </section>
    );
}