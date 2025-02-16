import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { VscAdd, VscAccount, VscEllipsis } from "react-icons/vsc";
import { Contractor } from "../../types/types";
import "../../styles/fancyTables.scss";
import "../../styles/ModalStyles.scss";
import PageHeader from "../../components/PageHeader";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TruncatedCell from "../../components/TruncatedCell";
import ConfirmationModal from "../../components/ConfirmationModal";
import SortTable from "../../components/SortTable";
import useFetchContractors from "../../hooks/useFetchContractors";
import api from "../../services/api";

const ContractorList: React.FC = () => {
  const { contractors, loading } = useFetchContractors();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContractors, setFilteredContractors] =
    useState<Contractor[]>(contractors);

  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [contractorToDelete, setContractorToDelete] = useState<number | null>(
    null,
  );

  // Global click handler to close the action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // If the clicked element is not inside an element with class "actions-column", close the menu
      if (!target.closest(".actions-column")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = contractors.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.taxId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatAddress(c).toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredContractors(filtered);
  }, [searchTerm, contractors]);

  const openModal = (id: number) => {
    setContractorToDelete(id);
    setModalIsOpen(true);
    setActiveMenu(null);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setContractorToDelete(null);
  };

  const handleDelete = async () => {
    if (contractorToDelete === null) return;
    try {
      await api.delete(`/contractors/${contractorToDelete}`);
      toast.success("Kontrahent został pomyślnie usunięty!");
      setFilteredContractors(
        filteredContractors.filter((c) => c.id !== contractorToDelete),
      );
      closeModal();
    } catch (error) {
      console.error("Error deleting contractor", error);
      alert("Nie można usunąć kontrahenta posiadającego faktury.");
      closeModal();
    }
  };

  const formatDate = (isoDate: string) => new Date(isoDate).toLocaleString();

  const formatAddress = (contractor: Contractor) =>
    `${contractor.street} ${contractor.buildingNumber} m.${contractor.apartmentNumber}, ${contractor.postalCode} ${contractor.city}`;

  const getValue = (contractor: Contractor, column: string) => {
    switch (column) {
      case "name":
        return contractor.name;
      case "firstName":
        return contractor.firstName;
      case "lastName":
        return contractor.lastName;
      case "email":
        return contractor.email;
      case "taxId":
        return contractor.taxId;
      case "address":
        return formatAddress(contractor);
      case "createdAt":
        return new Date(contractor.createdAt).getTime();
      default:
        return contractor.name;
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }} data-testid="contractor_list_page">
      <PageHeader
        title="Lista kontrahentów"
        icon={<VscAccount />}
        actionLink="/contractors/new"
        actionIcon={<VscAdd size={24} />}
        actionTooltip="Dodaj nowego kontrahenta"
        onSearch={handleSearch}
        data-testid="page_header"
      />
      {loading ? (
        <Loader data-testid="loader" />
      ) : (
        <SortTable
          data={filteredContractors}
          columns={[
            { key: "name", label: "Nazwa" },
            { key: "firstName", label: "Imię" },
            { key: "lastName", label: "Nazwisko" },
            { key: "email", label: "Email" },
            { key: "taxId", label: "NIP" },
            { key: "address", label: "Adres" },
            { key: "createdAt", label: "Data utworzenia" },
            { key: "actions", label: "Akcje" },
          ]}
          getValue={getValue}
          renderRow={(contractor) => (
            <tr key={contractor.id} data-testid={`contractor_row_${contractor.id}`}>
              <TruncatedCell
                text={contractor.name}
                className="tooltip-cell name-column"
              />
              <TruncatedCell
                text={contractor.firstName}
                className="tooltip-cell firstName-column"
              />
              <TruncatedCell
                text={contractor.lastName}
                className="tooltip-cell lastName-column"
              />
              <TruncatedCell
                text={contractor.email}
                className="tooltip-cell email-column"
              />
              <TruncatedCell
                text={contractor.taxId}
                className="tooltip-cell taxId-column"
              />
              <TruncatedCell
                text={formatAddress(contractor)}
                className="tooltip-cell address-column"
              />
              <TruncatedCell
                text={formatDate(contractor.createdAt)}
                className="tooltip-cell date-column"
              />
              <td style={{ position: "relative" }} className="actions-column">
                <button
                  className="ellipsis-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling so that click on button doesn't trigger the document listener immediately
                    setActiveMenu(
                      activeMenu === contractor.id ? null : contractor.id,
                    );
                  }}
                  data-testid={`actions_button_${contractor.id}`}
                >
                  <VscEllipsis size={24} />
                </button>
                {activeMenu === contractor.id && (
                  <nav className="header-nav" data-testid={`actions_dropdown_${contractor.id}`}>
                    <ul>
                      <li>
                        <Link
                          to={`/contractors/edit/${contractor.id}`}
                          onClick={() => setActiveMenu(null)}
                          data-testid={`edit_link_${contractor.id}`}
                        >
                          Edytuj
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => openModal(contractor.id)}
                          data-testid={`delete_button_${contractor.id}`}
                        >
                          Usuń
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </td>
            </tr>
          )}
          data-testid="sort_table"
        />
      )}
      <ConfirmationModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        onConfirm={handleDelete}
        title="Potwierdzenie usunięcia"
        message={`Czy na pewno chcesz usunąć kontrahenta ${contractorToDelete ? contractorToDelete : ""}?`}
        data-testid="confirmation_modal_wrapper"
      />
    </div>
  );
};

export default ContractorList;
