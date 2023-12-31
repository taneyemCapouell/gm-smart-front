import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BsPrinterFill } from "react-icons/bs";
import { HiRefresh } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import ProductHistoryModel from "../../Model/ProductHistory";
import Storage from "../../service/Storage";
import DashboardLayout from "../../templates/DashboardLayout";
import { baseURL, http_client } from "../../utils/axios-custum";
import DefautProductImage from "../../assets/img/default-product.png";
import { formatDate, roleIs } from "../../utils/function";
import { FaEye } from "react-icons/fa";
import Loader from "../../atoms/Loader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import HistoriesPrint from "../../templates/HistoryPrint";
import { useSelector } from "react-redux";

type TypeProductHistory = {};

const GET_HISTORY = "history/all";
const API_STORAGE_URL = `${baseURL}/storage`;

const ProductHistory: React.FC<TypeProductHistory> = () => {
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [histories, setHistories] = useState<ProductHistoryModel[]>([]);

  const companiesStore = useSelector((state: any) => state.companies);

  const navigate = useNavigate();

  const filteredItems = histories.filter(
    (item) =>
      (item.product?.name &&
        item.product.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.created_at &&
        item.created_at.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.quantite &&
        item.quantite
          .toString()
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item?.type &&
        item.type.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.motif &&
        item.motif.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.product?.type_approvisionnement &&
        item.product.type_approvisionnement
          .toLowerCase()
          .includes(filterText.toLowerCase()))
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            autoFocus
            onChange={(e) => setFilterText(e.target.value)}
            type="text"
            id="table-search"
            className="bg-gray-100 border border-none focus:ring-2 text-gray-900 text-xs rounded-lg focus:ring-gray-700 focuslue-500 block w-80 pl-10 p-3 focus:bg-white  dark:bg-gray-700 dark:border-gray-600 ring-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-700 "
            placeholder="Search your product"
          />
          <span className=" absolute" onClick={handleClear}>
            x
          </span>
        </div>
      </>
    );
  }, [filterText, resetPaginationToggle]);

  const columns: TableColumn<ProductHistoryModel>[] = [
    {
      name: (
        <span className="  font-bold text-xs text-[#ac3265] uppercase">
          Name
        </span>
      ),
      cell: (row) => (
        <div className="font-bold flex space-y-1 flex-col justify-start items-start">
          <div className=" relative flex justify-center items-center">
            {row.product?.image ? (
              <img
                width={70}
                height={70}
                src={`${API_STORAGE_URL}/${row.product.image}`}
                alt="productimage"
              />
            ) : (
              <img
                width={70}
                height={70}
                src={DefautProductImage}
                className="opacity-50"
                alt="default-product"
              />
            )}
          </div>
          <span>{row.product?.name} </span>
        </div>
      ),
      sortable: true,
    },
    {
      name: (
        <span className="  font-bold text-xs text-[#ac3265] uppercase">
          DATE
        </span>
      ),
      cell: (row) => (
        <span className="">{formatDate(row.created_at || "") || "Aucun"}</span>
      ),
      sortable: true,
    },
    {
      name: (
        <span className="  font-bold text-xs text-[#ac3265] uppercase">
          Quantité (E/S)
        </span>
      ),
      cell: (row) => (
        <span>
          {row.quantite} {row.is_unite ? "Unité" : ""}
          {!row.is_unite ? row.product?.type_approvisionnement : ""}
          {(row.quantite || 0) > 1 && "s"}
        </span>
      ),
      sortable: true,
    },
    {
      name: (
        <span className="  font-bold text-xs text-[#ac3265] uppercase">
          AUTEUR DE LA TRANSACTION
        </span>
      ),
      cell: (row) => (
        <div>
          {row.user?.firstname} {row.user?.lastname}
        </div>
      ),
      sortable: true,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          TYPE
        </span>
      ),
      cell: (row) => row.type,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          MOTIF
        </span>
      ),
      cell: (row) => row.motif,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          actions
        </span>
      ),
      cell: (row) => (
        <Link
          to={`/products/show/${row.product?.id}/${row.product?.name
            ?.split(" ")
            .join("-")
            .toLowerCase()}`}
          className="p-2 text-white bg-gray-600 rounded-md text-lg"
        >
          <FaEye />
        </Link>
      ),
    },
  ];

  useEffect(() => {
    if (roleIs("admin") && !companiesStore?.currentCompany) {
      navigate("/dashboard");
    }

    const fetUsers = async () => {
      const res = await http_client(Storage.getStorage("auth").token).get(
        companiesStore.currentCompany
          ? `${GET_HISTORY}?id=${companiesStore?.currentCompany?.id}`
          : GET_HISTORY
      );
      setHistories(res.data);
      setLoading(false);
    };
    fetUsers();
  }, [navigate, companiesStore]);

  return (
    <DashboardLayout title="Historiques E/S">
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 font-bold items-center">
          <PDFDownloadLink
            document={
              <HistoriesPrint
                companyId={companiesStore?.currentCompany?.id || undefined}
                histories={histories}
              />
            }
            fileName="liste-entree_sortie.pdf"
            className="text-sm text-white px-4 rounded-md bg-gray-700 py-2"
          >
            {" "}
            <BsPrinterFill size={16} className="inline-block mr-1" />
            Imprimer l’historiques des entrées sorties produits
          </PDFDownloadLink>
          <Link
            to="/products/history/all"
            className="text-sm text-[#ac3265] px-4 rounded-md bg-white py-2"
          >
            {" "}
            <HiRefresh size={20} />
          </Link>
        </div>
      </div>

      {/* table */}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            <DataTable
              className=" rounded-md overflow-hidden"
              title="Historiques"
              pagination
              columns={columns}
              data={filteredItems}
              paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              responsive
            />
          </>
        ) : (
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductHistory;
