export default function StatsView({designStats}) {
    return (
        <div className="w-full">
            <div className="xl:grid xl:grid-cols-4 flex overflow-x-auto  gap-6 mb-8">
                {designStats.map((design, index) => (
                    <div key={index} className={`${design.color} rounded-lg shadow p-6`}>
                        <div className="flex items-center">
                            <div className={`${design.iconColor} p-2  rounded-lg `}>
                                {design.icon}
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-nowrap font-medium">{design.title}</p>
                                <p className="text-2xl font-bold">{design.valor}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

