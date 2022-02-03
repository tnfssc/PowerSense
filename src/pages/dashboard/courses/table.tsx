import { Table, Thead, Tbody, Tr, Th, Td, Button, Box } from "@chakra-ui/react";
import { useMemo } from "react";
import { Column, useTable } from "react-table";

import { CoursesList } from "../../../use/courses";
import Link from "../../../components/Link";

const CoursesTable: React.FC<{ courses: Array<CoursesList> }> = ({ courses }) => {
  console.log(courses);
  const columns = useMemo<Column<CoursesList>[]>(
    () => [
      {
        Header: "Course name",
        accessor: "name",
        Cell: ({ row }) => <Link href={`/courses/${row.original.id}`}>{row.original.name}</Link>,
      },
      {
        Header: "Status",
        accessor: "registered",
        Cell: ({
          row: {
            original: { paid, registered },
          },
        }) => (paid ? "Downloaded Question Paper" : registered ? "Registered" : "Not Registered"),
      },
      {
        Header: "Referral",
        Cell: "45-62-66-77 (active)",
      },
      {
        Header: "Deadline",
        Cell: "N/A",
      },
      {
        Header: "Question Paper",
        accessor: "id",
        Cell: ({ row }) => (
          <Link href={`/courses/${row.original.id}`}>
            <Button disabled={!row.original.registered}>{row.original.registered ? "Download" : "Register"}</Button>
          </Link>
        ),
      },
    ],
    [],
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: courses });
  return (
    <Box style={{ overflow: "auto", maxWidth: "100vw" }}>
      <Table {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup) => (
            // eslint-disable-next-line react/jsx-key
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // eslint-disable-next-line react/jsx-key
                <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              // eslint-disable-next-line react/jsx-key
              <Tr {...row.getRowProps()} _hover={{ bgColor: "rgba(255, 255, 255, 5)", color: "black" }}>
                {row.cells.map((cell) => (
                  // eslint-disable-next-line react/jsx-key
                  <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CoursesTable;
