import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  PopoverTrigger,
  CircularProgress,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { Column, useTable, Row, TableRowProps, CellProps } from "react-table";

import { CoursesList, useCourse } from "../../../use/courses";
import Link from "../../../components/Link";

const ButtonCell: React.FC<CellProps<CoursesList, string>> = ({ row }) => {
  const {
    course: { data, isLoading },
  } = useCourse(row.original.id);
  return (
    <Popover trigger="hover" isLazy>
      <PopoverTrigger>
        <Button variant="ghost">
          <Link href={`/courses/${row.original.id}`}>{row.original.name}</Link>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontWeight="semibold">{row.original.name}</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>{isLoading || !data ? <CircularProgress isIndeterminate /> : data.description}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const CoursesTable: React.FC<{ courses: Array<CoursesList> }> = ({ courses }) => {
  const columns = useMemo<Column<CoursesList>[]>(
    () => [
      {
        Header: "Course name",
        accessor: "name",
        Cell: ButtonCell,
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
        Header: "Deadline",
        Cell: "N/A",
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
            const { key, ...rowProps } = row.getRowProps();
            return <TableRow row={row} rowProps={rowProps} key={key} />;
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CoursesTable;

const TableRow: React.FC<{ row: Row<CoursesList>; rowProps: Omit<TableRowProps, "key"> }> = ({ row, rowProps }) => {
  return (
    <Tr {...rowProps}>
      {row.cells.map((cell) => {
        const { key, ...cellProps } = cell.getCellProps();
        return (
          <Td {...cellProps} key={key}>
            {cell.render("Cell")}
          </Td>
        );
      })}
    </Tr>
  );
};
