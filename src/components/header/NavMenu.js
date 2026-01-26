import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import axiosInstance from "../../config/axiosconfig";
import { useEffect, useState } from "react";

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  const { t } = useTranslation();

  const [mainCategories, setMainCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchMainCategories();
    fetchCategories();
    fetchSubcategories();
  }, []);

  // ✅ Helper: normalize API response to always return array
  const normalizeList = (data, possibleKeys = []) => {
    if (Array.isArray(data)) return data;

    if (data && typeof data === "object") {
      for (const key of possibleKeys) {
        if (Array.isArray(data[key])) return data[key];
      }
    }

    return [];
  };

  const fetchMainCategories = async () => {
    try {
      const response = await axiosInstance.get("/get-maincategory");
      const list = normalizeList(response.data, [
        "maincategories",
        "mainCategories",
        "data",
      ]);
      setMainCategories(list);
    } catch (error) {
      console.error("Error fetching main categories:", error);
      setMainCategories([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/get-category");
      const list = normalizeList(response.data, ["categories", "data"]);
      setCategories(list);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axiosInstance.get("/get-subcategory");
      const list = normalizeList(response.data, [
        "subcategories",
        "subCategories",
        "data",
      ]);
      setSubcategories(list);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubcategories([]);
    }
  };

  // ✅ Get categories belonging to main category
  const getCategoriesByMainCategory = (mainCategoryId) => {
    return (Array.isArray(categories) ? categories : []).filter((category) => {
      const mainData = category?.maincategoriesData;

      if (!mainData) return false;

      // Case 1: populated object { _id: ... }
      if (mainData?._id) return mainData._id === mainCategoryId;

      // Case 2: array [id] or [{_id}]
      if (Array.isArray(mainData)) {
        return mainData.some((m) => (m?._id || m) === mainCategoryId);
      }

      // Case 3: string id
      if (typeof mainData === "string") return mainData === mainCategoryId;

      return false;
    });
  };

  // ✅ Get subcategories belonging to category
  const getSubcategoriesByCategory = (categoryId) => {
    return (Array.isArray(subcategories) ? subcategories : []).filter(
      (subcategory) => {
        const cat = subcategory?.category;

        // Case 1: populated object { _id: ... }
        if (cat && typeof cat === "object" && cat._id) {
          return cat._id === categoryId;
        }

        // Case 2: string id
        if (typeof cat === "string") {
          return cat === categoryId;
        }

        return false;
      }
    );
  };

  return (
    <div
      className={clsx(
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
      )}
    >
      <nav>
        <ul>
          {/* ✅ Main categories */}
          {(Array.isArray(mainCategories) ? mainCategories : []).map(
            (mainCategory) => (
              <li key={mainCategory?._id}>
                <Link to={process.env.PUBLIC_URL + "/"}>
                  {mainCategory?.mainCategoryName || "Category"}
                  {sidebarMenu ? (
                    <span>
                      <i className="fa fa-angle-right"></i>
                    </span>
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </Link>

                {/* ✅ Categories */}
                <ul
                  className="mega-menu mega-menu-padding"
                  style={{ marginTop: "0", paddingTop: "0" }}
                >
                  {getCategoriesByMainCategory(mainCategory?._id).map(
                    (category) => (
                      <li key={category?._id}>
                        <Link to={process.env.PUBLIC_URL + ""}>
                          {category?.name || "Sub Category"}
                        </Link>

                        {/* ✅ Subcategories */}
                        <ul>
                          {getSubcategoriesByCategory(category?._id).map(
                            (subcategory) => (
                              <li key={subcategory?._id}>
                                <Link
                                  to={
                                    process.env.PUBLIC_URL +
                                    `/shop-grid-full-width/${subcategory?._id}`
                                  }
                                >
                                  {subcategory?.subcategoryname || "Item"}
                                </Link>
                              </li>
                            )
                          )}
                        </ul>
                      </li>
                    )
                  )}
                </ul>
              </li>
            )
          )}

          {/* Contact */}
          <li>
            <Link to={process.env.PUBLIC_URL + "/contact"}>
              {t("contact_us")}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
};

export default NavMenu;
