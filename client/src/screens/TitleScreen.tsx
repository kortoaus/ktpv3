"use client";

import HomeIcon from "@/components/icons/HomeIcon";
import PaymentIcon from "@/components/icons/PaymentIcon";
import PrinterIcon from "@/components/icons/PrinterICon";
import ProductIcon from "@/components/icons/ProductIcon";
import ReceiptIcon from "@/components/icons/ReceiptIcon";
import SignInIcon from "@/components/icons/SignInIcon";
import SignOutIcon from "@/components/icons/SignOutIcon";
import StaffIcon from "@/components/icons/StaffIcon";
import TableIcon from "@/components/icons/TableIcon";
import TagIcon from "@/components/icons/TagIcon";
import TimerIcon from "@/components/icons/TimerIcon";
import getRole from "@/libs/util";
import { Sale, Shift, Staff } from "@/types/model";
import Link from "next/link";
import React from "react";

type Props = {
  staff?: Staff;
  shift?: Shift | null;
  sales: Sale[];
};

const iconSize = 48;

export default function TitleScreen({ staff, shift, sales }: Props) {
  return (
    <div className="p-4 bg-gray-100 h-full grid grid-cols-2 gap-4">
      {/* Not Signed */}
      <>
        {staff ? (
          <div className="max-h-full flex flex-col gap-4">
            {getRole(staff, "isOpen") && (
              <>
                {shift ? (
                  <>
                    {sales && sales.length === 0 ? (
                      <LinkBtn
                        row={false}
                        className="bg-blue-500"
                        href="/shift/close"
                        label={`Close Shop`}
                        icon={<HomeIcon size={iconSize} />}
                      />
                    ) : (
                      <LinkBtn
                        row={false}
                        className="bg-blue-500"
                        href="/"
                        label={`${sales.length} Tables / ${sales.reduce(
                          (a, b) => a + b.pp,
                          0
                        )} pp left`}
                        icon={<HomeIcon size={iconSize} />}
                      />
                    )}
                  </>
                ) : (
                  <LinkBtn
                    row={false}
                    className="bg-gray-500 opacity-50"
                    href="/shift/open"
                    label={`Open Shop`}
                    icon={<HomeIcon size={iconSize} />}
                  />
                )}
              </>
            )}

            <LinkBtn
              row={false}
              className="bg-red-500"
              href="/auth/signout"
              label={`Sign Out(${staff.name})`}
              icon={<SignOutIcon size={iconSize} />}
            />
          </div>
        ) : (
          <div className="col-span-2">
            <LinkBtn
              row={false}
              className="bg-green-500"
              href="/auth"
              label={"Sign In"}
              icon={<SignInIcon size={iconSize} />}
            />
          </div>
        )}
      </>

      {/* Signed */}
      {staff && (
        <div className="grid grid-cols-2 grid-rows-4 gap-4 overflow-scroll">
          {getRole(staff, "isStaff") && (
            <LinkBtn
              className="bg-orange-500"
              href="/staff"
              label={"Manage Staff"}
              icon={<StaffIcon size={iconSize} />}
            />
          )}
          {getRole(staff, "isTable") && (
            <LinkBtn
              className="bg-orange-500"
              href="/tcontainer"
              label={"Manage Table"}
              icon={<TableIcon size={iconSize} />}
            />
          )}
          {getRole(staff, "isProduct") && (
            <LinkBtn
              className="bg-orange-500"
              href="/category"
              label={"Manage Category"}
              icon={<TagIcon size={iconSize} />}
            />
          )}
          {getRole(staff, "isProduct") && (
            <LinkBtn
              className="bg-orange-500"
              href="/product"
              label={"Manage Product"}
              icon={<ProductIcon size={iconSize} />}
            />
          )}
          {getRole(staff, "isBuffet") && (
            <LinkBtn
              className="bg-orange-500"
              href="/buffet"
              label={"Manage Buffet"}
              icon={<TimerIcon size={iconSize} />}
            />
          )}
          {getRole(staff, "isDirector") && (
            <LinkBtn
              className="bg-orange-500"
              href="/printer"
              label={"Manage Printer"}
              icon={<PrinterIcon size={iconSize} />}
            />
          )}
          {getRole(staff, "isDirector") && (
            <LinkBtn
              className="bg-orange-500"
              href="/printer"
              label={"Cash In/Out"}
              icon={<PaymentIcon size={iconSize} />}
            />
          )}
          {getRole(staff, "isDirector") && (
            <LinkBtn
              className="bg-orange-500"
              href="/receipt"
              label={"Receipts"}
              icon={<ReceiptIcon size={iconSize} />}
            />
          )}
        </div>
      )}
    </div>
  );
}

type LinkBtnProps = {
  icon: React.ReactNode;
  label: string;
  href: string;
  className: string;
  row?: boolean;
};

function LinkBtn({ icon, label, href, className, row = false }: LinkBtnProps) {
  return (
    <Link href={href} className="w-full h-full" prefetch={false}>
      <button
        className={`LinkBtn h-full p-4 rounded-md fccc gap-1 w-full text-white ${className} ${
          row ? `!flex-row` : ""
        }`}
      >
        <div className="icon">{icon}</div>
        <div className="label text-lg font-medium">{label}</div>
      </button>
    </Link>
  );
}
