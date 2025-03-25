import React, { useState } from 'react';
import { useTable, usePagination } from 'react-table';
import { Table, Button, Form } from 'react-bootstrap';
import './Inventario.css';

const Inventario: React.FC = () => {
  const [data, setData] = useState([
    { id: 1, nombre: 'Producto 1', cantidad: 10, precio: 100 },
    { id: 2, nombre: 'Producto 2', cantidad: 20, precio: 200 },
    { id: 3, nombre: 'Producto 3', cantidad: 30, precio: 300 }
    // Agrega más productos según sea necesario
  ]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Nombre',
        accessor: 'nombre',
      },
      {
        Header: 'Cantidad',
        accessor: 'cantidad',
      },
      {
        Header: 'Precio',
        accessor: 'precio',
      },
      {
        Header: 'Acciones',
        Cell: ({ row }: any) => (
          <Button variant="primary" onClick={() => handleEdit(row.original)}>
            Editar
          </Button>
        ),
      },
    ],
    []
  );

  const handleEdit = (row: any) => {
    // Lógica para editar el producto
    console.log('Editar producto:', row);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data }, usePagination);

  return (
    <div className="inventario-container">
      <h1 className="titulo">Inventario</h1>
      <Table {...getTableProps()} striped bordered hover className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="pagination">
        <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </Button>{' '}
        <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </Button>{' '}
        <Button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </Button>{' '}
        <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </Button>{' '}
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Ir a la página:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <Form.Control
          as="select"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
          style={{ width: '120px', display: 'inline-block' }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Mostrar {pageSize}
            </option>
          ))}
        </Form.Control>
      </div>
    </div>
  );
};

export default Inventario;