import { FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFileImage, FaDownload, FaEllipsisV } from "react-icons/fa";

export default function Documents() {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* HEADER & SEARCH */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Document Center</h2>
                    <p className="text-slate-500 text-sm">Access and manage all corporate resources.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
                        />
                    </div>
                    <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
                        <FaFilter className="text-sm" />
                    </button>
                </div>
            </div>

            {/* CATEGORIES */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <CategoryTab label="All Documents" active />
                <CategoryTab label="Technical Manuals" />
                <CategoryTab label="Project Reports" />
                <CategoryTab label="HR Policies" />
                <CategoryTab label="Legal" />
            </div>

            {/* DOCUMENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <DocumentCard name="Q4 Performance Report" type="pdf" size="2.4 MB" date="2 hours ago" />
                <DocumentCard name="Project Alpha Specs" type="doc" size="1.1 MB" date="Yesterday" />
                <DocumentCard name="Infrastructure Diagram" type="img" size="5.8 MB" date="Jan 15, 2026" />
                <DocumentCard name="Employee Handbook 2026" type="pdf" size="4.2 MB" date="Jan 12, 2026" />
                <DocumentCard name="Grid Modernization Plan" type="pdf" size="12.5 MB" date="Jan 10, 2026" />
                <DocumentCard name="Vendor Contact List" type="doc" size="450 KB" date="Jan 08, 2026" />
            </div>
        </div>
    );
}

function CategoryTab({ label, active }) {
    return (
        <button className={`
      px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all
      ${active
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }
    `}>
            {label}
        </button>
    );
}

function DocumentCard({ name, type, size, date }) {
    const icons = {
        pdf: <FaFilePdf className="text-red-500" />,
        doc: <FaFileWord className="text-blue-500" />,
        img: <FaFileImage className="text-emerald-500" />,
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">
                    {icons[type]}
                </div>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <FaEllipsisV className="text-xs" />
                </button>
            </div>
            <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1 truncate group-hover:text-blue-600 transition-colors">{name}</h4>
                <p className="text-[11px] text-slate-400 font-medium">{size} • {date}</p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
                <button className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                    <FaDownload />
                    Download
                </button>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">
                    {type}
                </span>
            </div>
        </div>
    );
}