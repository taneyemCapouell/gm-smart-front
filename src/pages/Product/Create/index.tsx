import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useEffect,
  useState,
  useRef,
} from "react";
import Category from "../../../Model/Category";
import ProductSupplier from "../../../Model/ProductSupplier";
import ProductType from "../../../Model/ProductType";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";
import DefaultProductImage from "../../../assets/img/default-product.png";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import Product from "../../../Model/Product";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { roleIs } from "../../../utils/function";

type TypeProductCreate = {};

const GET_CATEGORIES_URL = "categories";
const GET_PRODUCT_TYPE_URL = "products/types";
const GET_PRODUCT_SUPPLIER_URL = "products/suppliers";
const CREATE_PRODUCT_URL = "products";
const CREATE_SUPPLIERS_URL = "product-suppliers";

const ProductCreate: FC<TypeProductCreate> = () => {
  const [product, setProduct] = useState<Product>({});
  const [currentType, setCurrentType] = useState<string>("VENDU_PAR_PIECE");
  const [errForm, setErrForm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>(
    []
  );
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [urlImg, setUrlImg] = useState("");
  const [categorieInputFile, setCategorieInputFile] = useState<string>("");
  const [fournisseurInputFile, setFournisseurInputFile] = useState<string>("");
  const [sendingOne, setSendingOne] = useState(false);
  const [sendingTwo, setSendingTwo] = useState(false);
  const [reloadState, setReloadState] = useState(false);

  const companiesStore = useSelector((state: any) => state.companies);

  const formRef = useRef(null);

  const navigate = useNavigate();

  const handleChangImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setUrlImg(DefaultProductImage);
      return;
    }
    setProduct({ ...product, image: file });
    let url = URL.createObjectURL(file);
    setUrlImg(url);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formData = new FormData(formRef?.current || undefined);

    setSending(true);
    http_client(Storage.getStorage("auth").token)
      .post(
        companiesStore.currentCompany
          ? `${CREATE_PRODUCT_URL}?id=${companiesStore?.currentCompany?.id}`
          : CREATE_PRODUCT_URL,
        formData
      )
      .then((res) => {
        setSending(false);
        toast.success(res.data.message);
        setLoading(true);
        let id = window.setTimeout(() => {
          navigate(
            `/products/show/${res.data.product_id}/${res.data.product_name
              ?.split(" ")
              .join("-")
              .toLowerCase()}`
          );
          window.clearTimeout(id);
        }, 6000);
      })
      .catch((err) => {
        setSending(false);
        setErrForm(err.response.data.message);
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  const handleOnchange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (errForm) setErrForm("");

    switch (e.target.name) {
      case "name":
        setProduct({ ...product, name: e.target.value });
        break;
      case "description":
        setProduct({ ...product, description: e.target.value });
        break;
      case "prix_unitaire":
        setProduct({ ...product, prix_unitaire: e.target.value });
        break;
      case "product_type_id":
        setCurrentType(
          productTypes.find(
            (type) => (type.id || 1) === parseInt(e.target.value, 10)
          )?.name || ""
        );
        setProduct({
          ...product,
          product_type_id: e.target.value,
          poids: null,
          nbre_par_carton: null,
          qte_en_litre: null,
        });
        break;
      case "poids":
        setProduct({ ...product, poids: e.target.value });
        break;
      case "qte_en_litre":
        setProduct({ ...product, qte_en_litre: e.target.value });
        break;
      case "nbre_par_carton":
        setProduct({ ...product, nbre_par_carton: e.target.value });
        break;
      case "qte_stock_alert":
        setProduct({ ...product, qte_stock_alert: e.target.value });
        break;
      case "type_approvisionnement":
        setProduct({ ...product, type_approvisionnement: e.target.value });
        break;
      case "category_id":
        setProduct({ ...product, category_id: e.target.value });
        break;
      case "product_supplier_id":
        setProduct({ ...product, product_supplier_id: e.target.value });
        break;
    }
  };

  const saveNewCategorie = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("click");
    setSendingOne(true);
    http_client(Storage.getStorage("auth").token)
      .post(
        companiesStore.currentCompany
          ? `${GET_CATEGORIES_URL}?id=${companiesStore?.currentCompany?.id}`
          : GET_CATEGORIES_URL,
        { name: categorieInputFile }
      )
      .then((res) => {
        reload();
        setSendingOne(false);
      })
      .catch((err) => {
        setSendingOne(false);
        console.log(err);
      });
  };

  const saveNewFournisseur = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("click");
    setSendingTwo(true);
    http_client(Storage.getStorage("auth").token)
      .post(
        companiesStore.currentCompany
          ? `${CREATE_SUPPLIERS_URL}?id=${companiesStore?.currentCompany?.id}`
          : CREATE_SUPPLIERS_URL,
        {
          name: fournisseurInputFile,
        }
      )
      .then((res) => {
        setSendingTwo(false);
        reload();
      })
      .catch((err) => {
        setSendingTwo(false);
        console.log(err);
      });
  };

  const reload = () => {
    setReloadState(false);

    Promise.all([
      http_client(Storage.getStorage("auth").token).get(
        companiesStore.currentCompany
          ? `${GET_CATEGORIES_URL}?id=${companiesStore?.currentCompany?.id}`
          : GET_CATEGORIES_URL
      ),
      http_client(Storage.getStorage("auth").token).get(GET_PRODUCT_TYPE_URL),
      http_client(Storage.getStorage("auth").token).get(
        companiesStore.currentCompany
          ? `${GET_PRODUCT_SUPPLIER_URL}?id=${companiesStore?.currentCompany?.id}`
          : GET_PRODUCT_SUPPLIER_URL
      ),
    ])
      .then((res: any) => {
        setReloadState(true);
        setLoading(false);

        setCategories(res[0].data);

        setProductTypes(res[1].data);
        setProductSuppliers(res[2].data);

        setUrlImg(DefaultProductImage);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (roleIs("admin") && !companiesStore?.currentCompany) {
      navigate("/dashboard");
    }

    Promise.all([
      http_client(Storage.getStorage("auth").token).get(
        companiesStore.currentCompany
          ? `${GET_CATEGORIES_URL}?id=${companiesStore?.currentCompany?.id}`
          : GET_CATEGORIES_URL
      ),
      http_client(Storage.getStorage("auth").token).get(GET_PRODUCT_TYPE_URL),
      http_client(Storage.getStorage("auth").token).get(
        companiesStore.currentCompany
          ? `${GET_PRODUCT_SUPPLIER_URL}?id=${companiesStore?.currentCompany?.id}`
          : GET_PRODUCT_SUPPLIER_URL
      ),
    ])
      .then((res: any) => {
        setLoading(false);

        setCategories(res[0].data);

        setProductTypes(res[1].data);
        setProductSuppliers(res[2].data);

        setUrlImg(DefaultProductImage);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [companiesStore.currentCompany, navigate]);

  return (
    <DashboardLayout
      title="Gestion des produits"
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            | Ajouter un nouveau produit
          </div>
        </>
      }
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"
      >
        <div
          className={`max-w-5xl bg-white p-5 rounded-md mx-auto ${
            loading && "disabled"
          }`}
        >
          <div className="flex space-x-4 mb-4">
            <label
              htmlFor="image"
              className="w-[250px] h-[200px] cursor-pointer bg-slate-200 rounded-sm relative overflow-hidden"
            >
              <img
                src={urlImg}
                alt="product"
                className="absolute h-full w-full object-cover"
              />
            </label>

            <input
              accept="image/*"
              name="image"
              onChange={handleChangImageFile}
              type="file"
              id="image"
              hidden
              className="hidden"
            />

            <div className="w-[calc(100%-250px)]">
              <label
                htmlFor="description"
                className=" inline-block mb-1 text-sm "
              >
                Description du produit{" "}
                <span className="text-sm italic">(Optionnel )</span>
              </label>
              <textarea
                onChange={handleOnchange}
                name="description"
                placeholder="Entrer le description de votre produit ici .... "
                id="description"
                cols={10}
                rows={3}
                className="placeholder:text-gray-300 text-sm w-full ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
              >
                {product.description}
              </textarea>

              <div className="flex items-center justify-between space-x-4 mt-3">
                <div className="w-1/2">
                  <label htmlFor="name" className=" inline-block mb-1 text-sm">
                    Non du produit
                  </label>
                  <input
                    onChange={handleOnchange}
                    value={product.name || ""}
                    name="name"
                    autoFocus
                    required
                    type="text"
                    placeholder="Entrer le nom du produit ici .."
                    className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                  />
                </div>

                <div className="w-1/2">
                  <label
                    htmlFor="prix_unitaire"
                    className=" inline-block mb-1 text-sm"
                  >
                    Prix unitaire{" "}
                    <span className="text-sm italic">(In FCFA)</span>
                  </label>
                  <input
                    onChange={handleOnchange}
                    value={product.prix_unitaire || ""}
                    name="prix_unitaire"
                    required
                    type="number"
                    placeholder="Entrer le prix unitaire du produit"
                    className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="product_type_id"
                className=" inline-block mb-1 text-sm"
              >
                Type de produit
              </label>
              <select
                required
                onChange={handleOnchange}
                name="product_type_id"
                value={product.product_type_id || ""}
                id="product_type_id"
                className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
              >
                <option value="" className="text-gray-300">
                  -- Type de produit --
                </option>
                {productTypes.map((type) => (
                  <option value={type.id} key={type.id}>
                    {type.slug}
                  </option>
                ))}
              </select>
            </div>

            {currentType &&
              (currentType === "VENDU_PAR_PIECE" ||
                currentType === "VENDU_PAR_KG") && (
                <div className="w-1/2">
                  <label htmlFor="poids" className=" inline-block mb-1 text-sm">
                    Entrer le poids du produit{" "}
                    <span className="text-sm italic">(Kg,g)</span>
                  </label>
                  <input
                    onChange={handleOnchange}
                    value={product.poids || ""}
                    name="poids"
                    required
                    type="number"
                    placeholder="poids"
                    step={0.5}
                    min={0.5}
                    className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                  />
                </div>
              )}

            {currentType && currentType === "VENDU_PAR_LITRE" && (
              <div className="w-1/2">
                <label
                  htmlFor="qte_en_litre"
                  className=" inline-block mb-1 text-sm"
                >
                  Entrer la quantité en litre du produit{" "}
                  <span className="text-sm italic">(L,ml)</span>
                </label>
                <input
                  onChange={handleOnchange}
                  value={product.qte_en_litre || ""}
                  name="qte_en_litre"
                  required
                  type="number"
                  placeholder="Combien de litres par conteneur ?"
                  step={0.5}
                  min={0.5}
                  className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                />
              </div>
            )}

            {currentType && currentType === "VENDU_PAR_NOMBRE_PAR_CONTENEUR" && (
              <div className="w-1/2">
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <label
                      htmlFor="nbre_par_carton"
                      className=" inline-block mb-1 text-sm"
                    >
                      Nombre d'élément par conteneur
                    </label>
                    <input
                      onChange={handleOnchange}
                      value={product.nbre_par_carton || ""}
                      name="nbre_par_carton"
                      required
                      type="number"
                      placeholder="Combien d'éléments par conteneur pour ce produit ?"
                      step={1}
                      min={1}
                      className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                    />
                  </div>

                  <div className="w-1/2">
                    <label
                      htmlFor="poids"
                      className=" inline-block mb-1 text-sm"
                    >
                      Entrer le poids du produit{" "}
                      <span className="text-sm italic">(Kg,g)</span>
                    </label>
                    <input
                      onChange={handleOnchange}
                      value={product.poids || ""}
                      name="poids"
                      required
                      type="number"
                      placeholder="poids"
                      step={0.5}
                      min={0.5}
                      className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="qte_stock_alert"
                className=" inline-block mb-1 text-sm"
              >
                Quantité stock d'alerte
              </label>
              <input
                onChange={handleOnchange}
                value={product.qte_stock_alert || ""}
                name="qte_stock_alert"
                required
                type="number"
                placeholder="Entrer le stock d'alert"
                className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
              />
            </div>

            <div className="w-1/2">
              <label htmlFor="name" className=" inline-block mb-1 text-sm">
                Type d’approvisionnement{" "}
                <span className="text-sm italic">
                  (Par pièce , carton , seau , sac ,bidon ...)
                </span>
              </label>
              <input
                onChange={handleOnchange}
                value={product.type_approvisionnement || ""}
                name="type_approvisionnement"
                required
                type="text"
                placeholder="Comment est-ce que vous vous approvisionner ?"
                className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
              />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label
                htmlFor="category_id"
                className=" inline-block mb-1 text-sm"
              >
                Categorie
              </label>
              {categories.length >= 1 ? (
                <select
                  required
                  onChange={handleOnchange}
                  value={product.category_id || ""}
                  name="category_id"
                  id="category_id"
                  className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                >
                  <option value="" className="text-gray-300">
                    -- Sélectionner la catégorie de produit --
                  </option>
                  {categories.map((categoriy) => (
                    <option value={categoriy.id} key={categoriy.id}>
                      {categoriy.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className=" flex justify-between">
                  <input
                    value={categorieInputFile || ""}
                    onChange={(e) => setCategorieInputFile(e.target.value)}
                    type="text"
                    placeholder="Ajouter une nouvelle catégorie"
                    className="placeholder:text-gray-300 w-[70%] focus:ring-0 text-sm ring-0 bg-slate-100 border-none outline-none placeholder:italic rounded-md "
                  />
                  <button
                    onClick={saveNewCategorie}
                    className={`${
                      (!categorieInputFile || sendingOne) && "disabled"
                    } w-[30%] px-2 bg-green-400 rounded-tr-md flex justify-center items-center rounded-br-md text-white`}
                  >
                    {sendingOne ? (
                      <Loader className=" text-lg" />
                    ) : (
                      "Enregistrer"
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="w-1/2">
              <label
                htmlFor="product_supplier_id"
                className=" inline-block mb-1 text-sm"
              >
                Fournisseur
              </label>

              {productSuppliers.length >= 1 ? (
                <select
                  required
                  onChange={handleOnchange}
                  value={product.product_supplier_id || ""}
                  name="product_supplier_id"
                  id="product_supplier_id"
                  className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                >
                  <option value="" className="text-gray-300">
                    -- Sélectionner le fournisseur du produit --
                  </option>
                  {productSuppliers.map((supplier) => (
                    <option value={supplier.id} key={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className=" flex justify-between">
                  <input
                    value={fournisseurInputFile || ""}
                    onChange={(e) => setFournisseurInputFile(e.target.value)}
                    type="text"
                    placeholder="Ajouter un nouveau fournisseur"
                    className="placeholder:text-gray-300 w-[70%] focus:ring-0 text-sm ring-0 bg-slate-100 border-none outline-none placeholder:italic rounded-md "
                  />
                  <button
                    onClick={saveNewFournisseur}
                    className={`${
                      (!fournisseurInputFile || sendingTwo) && "disabled"
                    } w-[30%] px-2 bg-green-400 rounded-tr-md flex justify-center items-center rounded-br-md text-white`}
                  >
                    {sendingTwo ? (
                      <Loader className=" text-lg" />
                    ) : (
                      "Enregistrer"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className={`px-4 ${
                sending && "disabled"
              } py-2 bg-[#ac3265] text-white rounded-md flex justify-center items-center min-w-[200px] min-h-[35px]`}
            >
              {sending ? (
                <Loader className="text-lg" />
              ) : (
                "Enregistrer le produit"
              )}
            </button>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default ProductCreate;
