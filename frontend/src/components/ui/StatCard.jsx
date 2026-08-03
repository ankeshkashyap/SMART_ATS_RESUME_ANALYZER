export default function StatCard({title,value,icon:Icon,}){

        return(
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <Icon 
                size={30}
                className="text-primary mb-4"/>

                <div>
                <p className="text-sm text-gray-500">
                    {title}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {value}
                </h2>
                </div>
            </div>
        );
}