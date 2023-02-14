import React, { Component, Fragment } from "react";
import { BsCartCheck } from "react-icons/bs";
import { HiOutlineDownload } from "react-icons/hi";
import { MdEdit } from "react-icons/md";
import {
  DownloadCertificate,
  FC_GetRegisteredProducts,
  RegisteredProductInterface,
} from "../../actions";
import Alert, { AlertType } from "../../components/Alert/Alert";
import ExportToExcel from "../../components/GenerateReport/ExportToExcel";
import Loading from "../../components/Loading/Loading";
import MainContainer from "../../components/MainContainer/MainContainer";
import Modal, { ModalSize, Themes } from "../../components/Modal/Modal";
import { RegisterProduct } from "../../components/RegisterProduct/RegisterProduct";
import { search } from "../../utils/functions";

interface ProductsListProps {}
interface ProductsListState {
  loading: boolean;
  data: RegisteredProductInterface[] | null;
  error: string;
  success: string;
  search_data: string;
  download_certificate: RegisteredProductInterface | null;
  edit_product: RegisteredProductInterface | null;
}

export class ProductsList extends Component<
  ProductsListProps,
  ProductsListState
> {
  constructor(props: ProductsListProps) {
    super(props);

    this.state = {
      loading: false,
      data: null,
      error: "",
      success: "",
      search_data: "",
      download_certificate: null,
      edit_product: null,
    };
  }
  FilteredData = () => {
    if (this.state.data !== null) {
      return search(
        this.state.data,
        this.state.search_data
      ) as RegisteredProductInterface[];
    }
    return [];
  };

  DownloadRegistrationCertificate = (application_ref_number: string) => {
    this.setState({ loading: true });
    DownloadCertificate(
      application_ref_number,
      (
        loading: boolean,
        feedback: {
          type: "success" | "error";
          msg: string;
        } | null
      ) => {
        this.setState({ loading: loading });
        if (feedback?.type === "success") {
          this.setState({
            success: "Certificate is being downloaded...",
            download_certificate: null,
            error: "",
          });
        } else {
          if (feedback?.type === "error") {
            if (feedback.msg === "") {
              this.setState({
                error: "Failed to download, please try again!",
                success: "",
              });
            } else {
              this.setState({ error: feedback.msg, success: "" });
            }
          }
        }
      }
    );
  };

  GetRegisteredProducts = () => {
    FC_GetRegisteredProducts(
      (
        loading: boolean,
        feedback: {
          type: "success" | "error";
          msg: string;
        } | null,
        data: RegisteredProductInterface[] | null
      ) => {
        this.setState({ loading: loading });
        if (feedback !== null && feedback.type === "success") {
          this.setState({ data: data, error: "" });
        }
        if (feedback !== null && feedback.type === "error") {
          this.setState({ data: [], error: feedback.msg, success: "" });
        }
      }
    );
  };

  componentDidMount(): void {
    if (this.state.data === null) {
      this.setState({ loading: true });
      this.GetRegisteredProducts();
    }
  }
  render() {
    if (this.state.edit_product !== null) {
      return (
        <RegisterProduct
          type={"Edit"}
          display={"Page"}
          editData={{
            application_ref_number:
              this.state.edit_product.application_ref_number,
            date_ma_certificate_issued_to_applicant:
              this.state.edit_product.date_ma_certificate_issued_to_applicant,
            distribution_category:
              this.state.edit_product.distribution_category === null
                ? ""
                : this.state.edit_product.distribution_category,
            name_of_marketing_authorization_holder:
              this.state.edit_product.name_of_marketing_authorization_holder ===
              null
                ? ""
                : this.state.edit_product
                    .name_of_marketing_authorization_holder,
            name_of_the_active_ingredient:
              this.state.edit_product.name_of_the_active_ingredient === null
                ? ""
                : this.state.edit_product.name_of_the_active_ingredient,
            pack_size:
              this.state.edit_product.pack_size === null
                ? ""
                : this.state.edit_product.pack_size,
            pack_type:
              this.state.edit_product.pack_type === null
                ? ""
                : this.state.edit_product.pack_type,
            registration_number:
              this.state.edit_product.registration_number === null
                ? ""
                : this.state.edit_product.registration_number,
            shelf_life_in_month:
              this.state.edit_product.shelf_life_in_month === null
                ? ""
                : this.state.edit_product.shelf_life_in_month,
            storage_statement:
              this.state.edit_product.storage_statement === null
                ? ""
                : this.state.edit_product.storage_statement,
            therapeutic_indication:
              this.state.edit_product.therapeutic_indication === null
                ? ""
                : this.state.edit_product.therapeutic_indication,
            product_category:
              this.state.edit_product.product_category === null
                ? ""
                : this.state.edit_product.product_category,
          }}
          onBack={() => this.setState({ edit_product: null })}
          onSave={() => {
            this.GetRegisteredProducts();
            this.setState({
              success: `Product for ${this.state.edit_product?.application_ref_number} has been registered successfully!`,
            });
            this.setState({ edit_product: null });
          }}
        />
      );
    }
    return (
      <Fragment>
        <div>
          <MainContainer className="mt-3 animate__animated animate__fadeIn">
            <div className="">
              <div className="flex flex-row items-center gap-3 mb-3 mx-2">
                <div className="">
                  <div>
                    <BsCartCheck className="text-4xl" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold">
                    List of registered products
                  </span>
                  <span className="text-xs">
                    This page shows you list of products that have been
                    confirmed to be registered
                  </span>
                </div>
              </div>
            </div>
            {/* Message section */}
            {this.state.error !== "" && (
              <div className="my-3 fixed right-2 top-16 z-50">
                <Alert
                  alertType={AlertType.DANGER}
                  title={"Error Occurred"}
                  description={this.state.error}
                  close={() => this.setState({ error: "", success: "" })}
                />
              </div>
            )}
            {this.state.success !== "" && (
              <div className="my-3 fixed right-2 top-16 z-50">
                <Alert
                  alertType={AlertType.SUCCESS}
                  title={"Action succeeded"}
                  description={this.state.success}
                  close={() => this.setState({ error: "", success: "" })}
                />
              </div>
            )}
            {/* Table */}
            <div className="flex flex-row items-center justify-between gap-2">
              <input
                type="text"
                value={this.state.search_data}
                onChange={(e) => {
                  this.setState({
                    search_data: e.target.value,
                    error: "",
                    success: "",
                  });
                }}
                placeholder={"Search..."}
                className="px-3 py-2 rounded-md w-1/2 border border-gray-400"
              />
              <div className="flex flex-row items-center justify-end gap-3">
                <div className="flex flex-col">
                  <span className="text-xs">Total products</span>
                  <span className="text-2xl font-extrabold">
                    {this.FilteredData().length}
                  </span>
                </div>
                <div>
                  <ExportToExcel
                    fileData={this.FilteredData()}
                    fileName={`Report of registered products`}
                    btnName="Download EXCEL"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 w-full overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-primary-300 text-primary-900 text-xs bg-primary-50">
                  <tr>
                    <th className="px-2 py-2 truncate">#</th>
                    <th className="px-2 py-2 truncate">Registration number</th>
                    <th className="px-2 py-2 truncate">
                      Application ref number
                    </th>
                    <th className="px-2 py-2 truncate">Applicant name</th>
                    <th className="px-2 py-2 truncate">
                      Manufacturer name and country
                    </th>
                    <th className="px-2 py-2 truncate">
                      Name of marketing authorization holder
                    </th>
                    <th className="px-2 py-2 truncate">
                      Date ma certificate issued to applicant
                    </th>
                    <th className="px-2 py-2 truncate">
                      Distribution category
                    </th>
                    <th className="px-2 py-2 truncate">
                      Name of the active ingredient
                    </th>
                    <th className="px-2 py-2 truncate">
                      Manufacturing site address
                    </th>
                    <th className="px-2 py-2 truncate">Packaging type</th>
                    <th className="px-2 py-2 truncate">Pack size</th>
                    <th className="px-2 py-2 truncate">Product brand name</th>
                    <th className="px-2 py-2 truncate">Product common name</th>
                    <th className="px-2 py-2 truncate">Product category</th>
                    <th className="px-2 py-2 truncate">Product strength</th>
                    <th className="px-2 py-2 truncate">
                      Product dosage form and appearance
                    </th>
                    <th className="px-2 py-2 truncate">Submission date</th>
                    <th className="px-2 py-2 truncate">
                      Local technical representative
                    </th>
                    <th className="px-2 py-2 truncate">Applicant address</th>
                    <th className="px-2 py-2 truncate">
                      Therapeutic indication
                    </th>
                    <th className="px-2 py-2 truncate">Shelf life in month</th>
                    <th className="px-2 py-2 truncate">Storage statement</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {this.state.data === null ? (
                    <tr>
                      <td colSpan={22} className="p-2">
                        <div className="bg-white flex flex-col">
                          <Loading />
                          <div className="-mt-10 ml-4 font-light text-lg">
                            Loading, please wait...
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : this.FilteredData().length === 0 ? (
                    <tr>
                      <td
                        colSpan={22}
                        className="text-left text-lg font-light py-5 px-6"
                      >
                        No data found!
                      </td>
                    </tr>
                  ) : (
                    this.FilteredData().map((item, i) => (
                      <tr
                        key={i + 1}
                        className={`${
                          i % 2 !== 0 ? "bg-gray-100" : "bg-white"
                        } hover:bg-primary-100 hover:text-primary-900 font-light animate__animated animate__fadeIn group cursor-pointer`}
                        onClick={() =>
                          this.setState({ download_certificate: item })
                        }
                      >
                        <td className="px-2 py-1">{i + 1}</td>
                        <td className="px-2 py-1">
                          {item.registration_number}
                        </td>
                        <td className="px-2 py-1">
                          {item.application_ref_number}
                        </td>
                        <td className="px-2 py-1">{item.applicant_name}</td>
                        <td className="px-2 py-1">
                          {item.manufacturer_name_and_country}
                        </td>
                        <td className="px-2 py-1">
                          {item.name_of_marketing_authorization_holder}
                        </td>
                        <td className="px-2 py-1">
                          {item.date_ma_certificate_issued_to_applicant}
                        </td>
                        <td className="px-2 py-1">
                          {item.distribution_category}
                        </td>
                        <td className="px-2 py-1">
                          {item.name_of_the_active_ingredient}
                        </td>
                        <td className="px-2 py-1">
                          {item.manufacturing_site_address}
                        </td>
                        <td className="px-2 py-1">{item.pack_type}</td>
                        <td className="px-2 py-1">{item.pack_size}</td>
                        <td className="px-2 py-1">{item.product_brand_name}</td>
                        <td className="px-2 py-1">
                          {item.product_common_name}
                        </td>
                        <td className="px-2 py-1">{item.product_category}</td>
                        <td className="px-2 py-1">{item.product_strength}</td>
                        <td className="px-2 py-1">
                          {item.product_dosage_form}
                        </td>
                        <td className="px-2 py-1">{item.submission_date}</td>
                        <td className="px-2 py-1">
                          {item.local_technical_representative}
                        </td>
                        <td className="px-2 py-1">{item.applicant_address}</td>
                        <td className="px-2 py-1">
                          {item.therapeutic_indication}
                        </td>
                        <td className="px-2 py-1">
                          {item.shelf_life_in_month}
                        </td>
                        <td className="px-2 py-1">{item.storage_statement}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </MainContainer>
        </div>
        {this.state.download_certificate !== null && (
          <Modal
            backDrop={true}
            theme={Themes.default}
            close={() =>
              this.state.loading === false &&
              this.setState({ download_certificate: null })
            }
            backDropClose={true}
            widthSizeClass={ModalSize.medium}
            displayClose={true}
            padding={{
              title: true,
              body: true,
              footer: undefined,
            }}
            title={
              <div className="">
                Action menu for{" "}
                {this.state.download_certificate.registration_number} product
              </div>
            }
          >
            {this.state.loading === true ? (
              <div className="bg-white flex flex-col">
                <Loading />
                <div className="-mt-10 ml-4 font-light text-lg">
                  Loading, please wait...
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-12 -mt-3 gap-4">
                <div
                  onClick={() =>
                    this.DownloadRegistrationCertificate(
                      this.state.download_certificate!.application_ref_number
                    )
                  }
                  className="col-span-6 rounded-md bg-primary-100 hover:bg-primary-800 text-primary-900 hover:text-white p-3 flex flex-col items-center justify-center cursor-pointer text-center group"
                >
                  <div>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white group-hover:bg-primary-700">
                      <HiOutlineDownload className="text-6xl" />
                    </div>
                  </div>
                  <div className="font-extrabold mt-1 text-lg">
                    Download certificate
                  </div>
                  <div className="text-sm font-light">
                    The system generate a product registration certificate in
                    format of PDF file
                  </div>
                  {/* <div className=" mt-2">
                    <BsArrowRight className="text-3xl" />
                  </div> */}
                </div>
                <div
                  onClick={() =>
                    this.setState({
                      edit_product: this.state.download_certificate,
                    })
                  }
                  className="col-span-6 rounded-md bg-primary-100 hover:bg-primary-800 text-primary-900 hover:text-white p-3 flex flex-col items-center justify-center cursor-pointer text-center group"
                >
                  <div>
                    <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white group-hover:bg-primary-700">
                      <MdEdit className="text-6xl" />
                    </div>
                  </div>
                  <div className="font-extrabold mt-1 text-lg">
                    Edit product
                  </div>
                  <div className="text-sm font-light">
                    Change product information or details
                  </div>
                  {/* <div className=" mt-2">
                    <BsArrowRight className="text-3xl" />
                  </div> */}
                </div>
              </div>
            )}
          </Modal>
        )}
      </Fragment>
    );
  }
}
