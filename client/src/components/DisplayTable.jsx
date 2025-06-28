import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'



const DisplayTable = ({ data, columns }) => {

    const table = useReactTable({
         data,
         columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className="p-2">
            <table className='w-full '> 
                <thead className=' bg-black text-white'>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            
                                <th>Sr.No</th>
                            
                            {headerGroup.headers.map(header => (
                                <th className=' border' key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row,index) => (
                        <tr key={row.id} className=' border'>
                            <td className=' border'>{index + 1}</td>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className=' px-1 border
                                '>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
     
            </table>
        </div>
    )
}


export default DisplayTable