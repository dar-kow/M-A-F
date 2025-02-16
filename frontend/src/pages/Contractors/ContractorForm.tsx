import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/ContractorForm.scss";
import { Contractor } from "../../types/types";
import PageHeader from "../../components/PageHeader";
import { VscAccount } from "react-icons/vsc";

const ContractorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<
    Omit<Contractor, "createdAt" | "Invoices">
  >({
    id: 0,
    name: "",
    email: "",
    firstName: "",
    lastName: "",
    taxId: "",
    street: "",
    buildingNumber: "",
    apartmentNumber: "",
    city: "",
    postalCode: "",
  });
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchContractor = async () => {
        try {
          const response = await api.get<Contractor>(`/contractors/${id}`);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { createdAt, ...rest } = response.data;
          setContractor(rest);
        } catch (error) {
          console.error("Error fetching contractor", error);
          toast.error("Błąd pobierania danych kontrahenta");
        }
      };
      fetchContractor();
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContractor({ ...contractor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !contractor.name.trim() ||
      !contractor.email.trim() ||
      !contractor.firstName.trim() ||
      !contractor.lastName.trim() ||
      !contractor.taxId.trim() ||
      !contractor.street.trim() ||
      !contractor.buildingNumber.trim() ||
      !contractor.apartmentNumber.trim() ||
      !contractor.city.trim() ||
      !contractor.postalCode.trim()
    ) {
      alert("Wszystkie pola są wymagane!");
      return;
    }
    try {
      if (isEditing) {
        await api.put(`/Contractors/${id}`, contractor);
        toast.success("Edycja zakończona pomyślnie");
      } else {
        // Przy nowym kontrahencie usuwamy id, by serwer mógł je nadać
        const { id, ...newContractor } = contractor;
        await api.post("/contractors", newContractor);
        toast.success("Kontrahent dodany pomyślnie");
      }
      navigate("/contractors");
    } catch (error) {
      console.error("Error saving contractor", error);
      toast.error(
        isEditing ? "Edycja nieudana" : "Dodanie kontrahenta nie powiodło się",
      );
    }
  };

  return (
    <>
      <PageHeader
        title={isEditing ? "Edytuj kontrahenta" : "Dodaj kontrahenta"}
        icon={<VscAccount />}
        data-testid="page_header"
      />
      <div className="contractor-form-container" data-testid="contractor_form_container">
        <form onSubmit={handleSubmit} className="contractor-form" data-testid="contractor_form">
          {/* Row 1: Name and Email */}
          <div className="form-row" data-testid="form_row_name_email">
            <div className="form-group half">
              <label data-testid="label_contractor_name">Nazwa:</label>
              <input
                type="text"
                name="name"
                value={contractor.name}
                onChange={handleChange}
                required
                placeholder="Nazwa kontrahenta"
                title="Pole Nazwa jest wymagane."
                data-testid="input_contractor_name"
              />
            </div>
            <div className="form-group half">
              <label data-testid="label_contractor_email">Email:</label>
              <input
                type="email"
                name="email"
                value={contractor.email}
                onChange={handleChange}
                required
                placeholder="Adres email"
                title="Podaj poprawny adres email."
                data-testid="input_contractor_email"
              />
            </div>
          </div>

          {/* Row 2: First Name and Last Name */}
          <div className="form-row" data-testid="form_row_first_last_name">
            <div className="form-group half">
              <label data-testid="label_contractor_first_name">Imię:</label>
              <input
                type="text"
                name="firstName"
                value={contractor.firstName}
                onChange={handleChange}
                required
                placeholder="Imię"
                pattern="^[A-Za-z]+$"
                title="Imię może zawierać tylko litery."
                data-testid="input_contractor_first_name"
              />
            </div>
            <div className="form-group half">
              <label data-testid="label_contractor_last_name">Nazwisko:</label>
              <input
                type="text"
                name="lastName"
                value={contractor.lastName}
                onChange={handleChange}
                required
                placeholder="Nazwisko"
                pattern="^[A-Za-z]+$"
                title="Nazwisko może zawierać tylko litery."
                data-testid="input_contractor_last_name"
              />
            </div>
          </div>

          {/* Row 3: Tax ID */}
          <div className="form-row" data-testid="form_row_tax_id">
            <div className="form-group full">
              <label data-testid="label_contractor_tax_id">NIP:</label>
              <input
                type="text"
                name="taxId"
                value={contractor.taxId}
                onChange={handleChange}
                required
                placeholder="Numer Identyfikacji Podatkowej"
                pattern="^[0-9]+$"
                title="NIP może zawierać tylko cyfry."
                data-testid="input_contractor_tax_id"
              />
            </div>
          </div>

          {/* Row 4: Street */}
          <div className="form-row" data-testid="form_row_street">
            <div className="form-group full">
              <label data-testid="label_contractor_street">Ulica:</label>
              <input
                type="text"
                name="street"
                value={contractor.street}
                onChange={handleChange}
                required
                placeholder="Nazwa ulicy"
                title="Pole Ulica jest wymagane."
                data-testid="input_contractor_street"
              />
            </div>
          </div>

          {/* Row 5: Building and Apartment Numbers */}
          <div className="form-row" data-testid="form_row_building_apartment">
            <div className="form-group half">
              <label data-testid="label_contractor_building_number">Nr budynku:</label>
              <input
                type="text"
                name="buildingNumber"
                value={contractor.buildingNumber}
                onChange={handleChange}
                required
                placeholder="Numer budynku"
                title="Pole Nr budynku jest wymagane."
                data-testid="input_contractor_building_number"
              />
            </div>
            <div className="form-group half">
              <label data-testid="label_contractor_apartment_number">Nr mieszkania:</label>
              <input
                type="text"
                name="apartmentNumber"
                value={contractor.apartmentNumber}
                onChange={handleChange}
                required
                placeholder="Numer mieszkania"
                title="Pole Nr mieszkania jest wymagane."
                data-testid="input_contractor_apartment_number"
              />
            </div>
          </div>

          {/* Row 6: Postal Code and City */}
          <div className="form-row" data-testid="form_row_postalcode_city">
            <div className="form-group one-third">
              <label data-testid="label_contractor_postal_code">Kod pocztowy:</label>
              <input
                type="text"
                name="postalCode"
                value={contractor.postalCode}
                onChange={handleChange}
                required
                placeholder="Kod pocztowy (np. 00-000)"
                pattern="^[0-9]{2}-[0-9]{3}$"
                title="Kod pocztowy w formacie NN-NNN."
                data-testid="input_contractor_postal_code"
              />
            </div>
            <div className="form-group two-thirds">
              <label data-testid="label_contractor_city">Miasto:</label>
              <input
                type="text"
                name="city"
                value={contractor.city}
                onChange={handleChange}
                required
                placeholder="Nazwa miasta"
                title="Pole Miasto jest wymagane."
                data-testid="input_contractor_city"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`submit-button ${isEditing ? "update-button" : "add-button"}`}
            data-testid="contractor_submit_button"
          >
            {isEditing ? "Aktualizuj" : "Dodaj"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ContractorForm;
