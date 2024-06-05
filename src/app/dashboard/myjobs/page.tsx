import Image from "next/image";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Metadata } from "next";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AddJob } from "@/components/AddJob";
import { getJobsList } from "@/actions/job.actions";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Jobs | JobSync",
};

async function MyJobs() {
  const jobsList = await getJobsList();
  console.log("JOB OBJECT: ", jobsList[5]);
  return (
    <div className="col-span-3">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader className="flex-row justify-between items-center">
          <CardTitle>My Jobs</CardTitle>
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Applied
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Interview</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Job
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="lg:max-w-screen-lg lg:max-h-screen overflow-y-scroll">
                  <AddJob />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Company Logo</span>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Source</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead className="hidden md:table-cell">
                  Date Applied
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobsList.map((job: any) => {
                return (
                  <TableRow key={job.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt="Company logo"
                        className="aspect-square rounded-md object-cover"
                        height="32"
                        src="/icons/amazon-logo.svg"
                        width="32"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {job.JobTitle?.label}
                    </TableCell>
                    <TableCell className="font-medium">
                      {job.Company?.label}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "w-[70px] justify-center",
                          job.Status?.value === "applied" && "bg-cyan-500",
                          job.Status?.value === "interview" && "bg-green-500"
                        )}
                      >
                        {job.Status?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {job.JobSource?.label}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {job.Location?.label}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(new Date(job.appliedDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>32</strong> products
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default MyJobs;
