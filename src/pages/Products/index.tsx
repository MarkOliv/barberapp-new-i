import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

import {
  IonContent,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  useIonToast,
} from "@ionic/react";

import hairProds from "../../assets/hair-prods.png";

import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { chevronBackOutline } from "ionicons/icons";
import supabase from "../../utils/supabase";
import { useAuth } from "../../contexts";

const Products = () => {
  const [showToast] = useIonToast();
  const { sessionUser } = useAuth();

  const [isOpen, setIsOpen] = React.useState(false);

  const [products, setProducts] = React.useState<Array<any>>([]);

  const schema = Yup.object().shape({
    name: Yup.string()
      .min(3, "nome do produto deve ter no minimo 3 caracteres")
      .required("O nome é obrigatório"),
    category: Yup.string().required("A categoria é obrigatória"),
    code: Yup.string(),
    price: Yup.number().required("Informe quanto custa o serviço"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const handleNewProduct = async (data: any) => {
    try {
      const { data: newServiceData, error } = await supabase
        .from("products")
        .insert([
          {
            name: data?.name,
            category: data?.category,
            code: data?.code,
            price: data?.price,
          },
        ]);

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        }).then(() => {
          setIsOpen(!isOpen);
        });
      }

      if (newServiceData) {
        await showToast({
          position: "top",
          message: "Produto cadastrado com sucesso",
          duration: 3000,
        }).then(() => {
          setIsOpen(!isOpen);
          getProducts();
        });
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    } finally {
    }
  };

  const getProducts = async () => {
    try {
      let { data: products, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        await showToast({
          position: "top",
          message: error.message,
          duration: 3000,
        });
      }

      if (products) {
        await setProducts(products);
      }
    } catch (error) {
      await showToast({
        position: "top",
        message: `${error}`,
        duration: 3000,
      });
    }
  };

  React.useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      {sessionUser && (
        <>
          <IonContent>
            <div className="h-screen bg-gray-100">
              <Link
                to="/app/home"
                className="flex items-center bg-white p-5 border-b h-24"
              >
                <IonIcon className="w-6 h-6" src={chevronBackOutline} />

                <IonTitle className="font-bold">Produto</IonTitle>
              </Link>
              <div className="py-10 px-5">
                {sessionUser?.user_metadata?.barber && (
                  <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex flex-col justify-center items-center h-32 col-span-2 shadow-md rounded-xl bg-gradient-to-l from-green-800 to-green-600"
                  >
                    {/* <IonIcon className="mb-5 w-8 h-8 text-white" src={bag} /> */}
                    <img className="w-14 h-14" src={hairProds} alt="" />
                    <IonText className="text-white my-1">
                      Cadastrar novo produto
                    </IonText>
                  </div>
                )}

                {/* SERVICES */}

                <div className="h-96 overflow-auto rounded-xl my-3">
                  <table className="w-full text-sm text-left text-gray-500 rounded-xl overflow-hidden">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                      <tr>
                        <th scope="col" className="py-3 px-6">
                          Nome do Serviço
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Categoria
                        </th>
                        <th scope="col" className="py-3 px-6">
                          Preço
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <tr key={index} className="bg-white border-b">
                          <th
                            scope="row"
                            className="py-4 px-6 font-medium text-gray-900"
                          >
                            <div
                              onClick={() => {
                                sessionUser?.user_metadata?.barber
                                  ? document.location.replace(
                                      `/app/edit-product/${product?.id}`
                                    )
                                  : console.log("access denied");
                              }}
                            >
                              {product?.name}
                            </div>
                          </th>
                          <td className="py-4 px-6 uppercase">
                            {product?.category}
                          </td>
                          <td className="py-4 px-6">R${product?.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Modal */}

                <IonModal
                  isOpen={isOpen}
                  initialBreakpoint={0.75}
                  breakpoints={[0, 0.25, 0.5, 0.75]}
                >
                  <div className="flex justify-around p-3 bg-gradient-to-l from-green-800 to-green-600">
                    <IonTitle className="text-white">
                      Cadastrar novo produto
                    </IonTitle>
                    <div className="p-2">
                      <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="ml-2 text-white"
                      >
                        FECHAR
                      </button>
                    </div>
                  </div>

                  <form
                    onSubmit={handleSubmit(handleNewProduct)}
                    className="ion-padding"
                  >
                    <IonLabel className="text-gray-600" position="stacked">
                      Nome
                    </IonLabel>
                    <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                      <IonInput
                        type="text"
                        className="placeholder: text-gray-600"
                        placeholder="Shampoo"
                        {...register("name")}
                      />
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="name"
                      as={<div style={{ color: "red" }} />}
                    />
                    <div className="py-5">
                      <IonLabel className="text-gray-600" position="stacked">
                        Categoria
                      </IonLabel>

                      <IonSelect
                        className="bg-gray-200 rounded-xl placeholder: text-gray-700 mt-3"
                        placeholder="Selecione a categoria"
                        {...register("category")}
                      >
                        <IonSelectOption value="shampoos">
                          Shampoos
                        </IonSelectOption>
                        <IonSelectOption value="condicionadores">
                          Condicionadores
                        </IonSelectOption>
                        <IonSelectOption value="cremes">Cremes</IonSelectOption>
                        <IonSelectOption value="bebidas">
                          Bebidas
                        </IonSelectOption>
                      </IonSelect>
                      <ErrorMessage
                        errors={errors}
                        name="category"
                        as={<div style={{ color: "red" }} />}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <IonLabel className="text-gray-600" position="stacked">
                          Código do produto
                        </IonLabel>
                        <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                          <IonInput
                            type={"text"}
                            className="placeholder: text-gray-600"
                            placeholder="20AB"
                            {...register("code")}
                          />
                        </div>
                        <ErrorMessage
                          errors={errors}
                          name="code"
                          as={<div style={{ color: "red" }} />}
                        />
                      </div>
                      <div>
                        <IonLabel className="text-gray-600" position="stacked">
                          Preço
                        </IonLabel>

                        <div className="flex items-center bg-gray-200 rounded-xl p-3 mt-3">
                          <IonLabel className="text-gray-400">R$</IonLabel>
                          <IonInput
                            step="0.01"
                            type={"number"}
                            className="placeholder: text-gray-600"
                            placeholder="15,50"
                            {...register("price")}
                          />
                        </div>
                        <ErrorMessage
                          errors={errors}
                          name="price"
                          as={<div style={{ color: "red" }} />}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="p-4 w-full rounded-xl text-white my-5 bg-gradient-to-l from-green-800 to-green-700"
                    >
                      SALVAR
                    </button>
                  </form>
                </IonModal>
              </div>
            </div>
          </IonContent>
        </>
      )}
      {sessionUser === null && (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
          <p className="text-black">você precisa estar logado</p>
          <Link to="/signup" className="text-cyan-500">
            Clique aqui
          </Link>
        </div>
      )}
    </IonPage>
  );
};

export default Products;
