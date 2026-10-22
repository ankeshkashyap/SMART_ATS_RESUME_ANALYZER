export default function StatCard({title,value,icon:Icon,}){

        return(
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <Icon
                size={30}
                className="text-primary mb-4"/>

                <div>
                <p className="text-sm text-text-secondary">
                    {title}
                </p>

                <h2 className="text-3xl font-bold mt-2 text-text-primary">
                    {value}
                </h2>
                </div>
            </div>
        );
}
