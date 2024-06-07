"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import {
  ListCollapse,
  MoreHorizontal,
  Pencil,
  Tags,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useEffect, useState } from "react";
import { TablePagination } from "./TablePagination";
import { getJobsList } from "@/actions/job.actions";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import JobDetails from "./JobDetails";

function MyJobsTable() {
  const labels = [
    "draft",
    "applied",
    "interview",
    "expired",
    "rejected",
    "offer",
    "archived",
  ];
  const [label, setLabel] = useState("feature");
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [curJobId, setCurJobId] = useState("");

  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  useEffect(() => {
    const loadJobs = async () => {
      const { data, total } = await getJobsList(currentPage, jobsPerPage);

      setJobs(data);
      setTotalJobs(total);
    };
    loadJobs();
  }, [currentPage]);
  const totalPages = Math.ceil(totalJobs / jobsPerPage);
  const startPostIndex = (currentPage - 1) * jobsPerPage + 1;
  const endPostIndex = Math.min(currentPage * jobsPerPage, totalJobs);

  const viewJobDetails = (jobId: string) => {
    setCurJobId(jobId);
    setDialogOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Company Logo</span>
            </TableHead>
            <TableHead className="hidden md:table-cell">Date Applied</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Source</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job: any) => {
            return (
              <TableRow
                key={job.id}
                className="cursor-pointer"
                onClick={() => viewJobDetails(job?.id)}
              >
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Company logo"
                    className="aspect-square rounded-md object-cover"
                    height="32"
                    src="/icons/amazon-logo.svg"
                    width="32"
                  />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(job.appliedDate, "PP")}
                </TableCell>
                <TableCell className="font-medium">
                  {job.JobTitle?.label}
                </TableCell>
                <TableCell className="font-medium">
                  {job.Company?.label}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {job.Location?.label}
                </TableCell>
                <TableCell>
                  {new Date() > job.dueDate && job.Status?.value === "draft" ? (
                    <Badge className="bg-red-500">Expired</Badge>
                  ) : (
                    <Badge
                      className={cn(
                        "w-[70px] justify-center",
                        job.Status?.value === "applied" && "bg-cyan-500",
                        job.Status?.value === "interview" && "bg-green-500"
                      )}
                    >
                      {job.Status?.label}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {job.JobSource?.label}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => viewJobDetails(job?.id)}
                        >
                          <ListCollapse className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <Tags className="mr-2 h-4 w-4" />
                            Change status
                          </DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="p-0">
                            <Command>
                              <CommandInput
                                placeholder="Filter label..."
                                autoFocus={true}
                              />
                              <CommandList>
                                <CommandEmpty>No label found.</CommandEmpty>
                                <CommandGroup>
                                  {labels.map((label) => (
                                    <CommandItem
                                      key={label}
                                      value={label}
                                      onSelect={(value) => {
                                        setLabel(value);
                                        setOpen(false);
                                      }}
                                    >
                                      {label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg lg:max-h-screen overflow-y-scroll">
          <JobDetails jobId={curJobId} />
        </DialogContent>
      </Dialog>
      <div className="text-xs text-muted-foreground">
        Showing
        <strong>
          {startPostIndex} to {endPostIndex}
        </strong>
        of
        <strong> {totalJobs}</strong> jobs
      </div>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}

export default MyJobsTable;
