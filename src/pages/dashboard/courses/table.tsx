import { Table, Thead, Tbody, Tr, Th, Td, Button, useToast, Box } from "@chakra-ui/react";
import { useMemo, useCallback } from "react";
import { Column, useTable } from "react-table";

import { CoursesList } from "../../../use/courses";
import Link from "../../../components/Link";

const CoursesTable: React.FC<{ courses: Array<CoursesList> }> = ({ courses }) => {
  const toast = useToast();
  const downloadQuestion = useCallback(
    (courseId: number) => {
      toast({
        title: "Coming soon",
        description: `The question paper for course ID: ${courseId} is not yet available.`,
        status: "info",
        position: "bottom-left",
      });
    },
    [toast],
  );
  const columns = useMemo<Column<CoursesList>[]>(
    () => [
      {
        Header: "Course name",
        accessor: "name",
        Cell: ({ row }) => <Link to={`/courses/${row.original.id}`}>{row.original.name}</Link>,
      },
      {
        Header: "Registration status",
        accessor: "registered",
        Cell: ({ cell: { value } }) => (value ? "Registered" : "Not registered"),
      },
      {
        Header: "Question Paper",
        accessor: "id",
        Cell: ({ cell: { value }, row }) => (
          <Button disabled={!row.original.registered} onClick={() => downloadQuestion(value)}>
            Download
          </Button>
        ),
      },
    ],
    [downloadQuestion],
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
