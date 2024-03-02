import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../redux/homepage/users";
import NavbarLogin from "../Navbars/NavbarLogin";
import FooterDown from "../FooterDown/FooterDown";
const Home = () => {
  const dispatch = useDispatch();
  const { user, auth } = useSelector((state) => {
    return {
      user: state.user.user,
      auth: state.auth
    };
  });

  const users = () => {
    axios
      .get(`http://localhost:5000/followers/all`, {
        headers: {
          authorization: `Bearer ${auth.token}`
        }
      })
      .then((result) => {
        console.log(result.data.result);
        dispatch(getAllUsers(result.data.result));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    users();
    console.log(user);
  }, []);
  return (
    <>
    <NavbarLogin/>
    <div class="container my-12 py-12 mx-auto px-4 md:px-6 lg:px-12">
      <section class="mb-20 text-gray-800">
        <div class="block rounded-lg shadow-lg bg-white">
          <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div class="inline-block min-w-full sm:px-6 lg:px-8">
                <div class="overflow-hidden">
                  <table class="min-w-full mb-0">
                    <thead class="border-b bg-gray-50 rounded-t-lg text-left">
                      <tr>
                        <th
                          scope="col"
                          class="rounded-tl-lg text-sm font-medium px-6 py-4"
                        >
                          NAME
                        </th>
                        <th scope="col" class="text-sm font-medium px-6 py-4">
                          COUNTRY
                        </th>{" "}
                        <th scope="col" class="text-sm font-medium px-6 py-4">
                          AGE
                        </th>
                        <th
                          scope="col"
                          class="rounded-tr-lg text-sm font-medium px-6 py-4"
                        ></th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.map((elem) => {
                        return (
                          <>
                            {" "}
                            <tr class="border-b">
                              <th
                                scope="row"
                                class="text-sm font-normal px-6 py-4 whitespace-nowrap text-left"
                              >
                                <div class="flex flex-row items-center">
                                  {elem.photo ? (
                                    <img
                                      class="rounded-full w-12"
                                      src={elem.photo}
                                      alt="Avatar"
                                    />
                                  ) : (
                                    <img
                                      class="rounded-full w-12"
                                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAM1BMVEX///+ZmZmVlZXZ2dmQkJDk5OS8vLzo6OjS0tK1tbXz8/P7+/v39/fs7OykpKTHx8eqqqq8lpdBAAAEZUlEQVR4nO1b2ZasIAyUiCLt+v9fe1unZ7pdoBJA23Mu9S4WIQkhS1FkZGRkZGRkZGRkZGRcgO7R98ZUVWVM/+i+zeYJ09R2GhS9oIbJ1o35Hp9HNQ5aP4lsQFrrYaweX6BU1QPpHaE/aBrq6lpG/ag8hP4kpsa+KNqLKFkFGb14KdtfQslMmsfoJa7pfLXv2FL6kNa5bqId98bGoEXjiYplpgBKM/R0mmo12OLctM4RVmfDKT1B9gRWlVTBd6xUcmdaxjH6QZmWUxMpph9Qcz9OaVk1Eh/uhU7GqklFSaWTVZlMTgurJNpesX71G3kykMAztAxGWtmxKctmtApLlVT0/dxCP/6MAj72XuEogmwsqRH9QttNvGQskhaNcZwM+AEdeWno/XVUzNCCWIXUYVhpwBHSFHM5o8MbHO+ox+D/LuYAO8CJnOG3QV+GWyCwPJ8fLMGnwRZo/LtVk+9jFDmHvnGQlnttqEe6Hsap97sDdALg7APdgvUuCuPIU7SqB5wUSKs80PchohqBMx/QAmf4KrRRKP4aXZtyThW69eBG0XWg5YEV2ieOa2FkX0s5oduLIylEynVzOlHBUC36+BRJzw+uiBUdx6xS+xsgqViXwFliA8azCmgEdL5P+5NxQmGwwubHeOprWajAeKiDmBZF0px9bQC9sUJvXc67mmSeipW18+lpi9VcMSz4E93EWdJn0tilzAtMklAd+vPXos4DBMHUL0Q+nWHOP3CwYicjJTEVeiEBVvwEqcQn8ElRvVOLrmYntNwPxwPA6/hj3WkjrBLfUO+PJVeygNTTL6vRvMTVmZGRobqC1JznGGw9jrUdhBUAESnG1bddnptcjCAlWZ82kHx6hvWRXmr+K8wdAdxyl4gUz3mSsmX/2MUKbdeXVvEkJnGejGuGyPqjBMugJbpm8IVM2/zrHgaHGqILGabLBlbdAPpRWZLDH+RRzUykgiy8MMjzhsOSUpQ3UheGw17vKSr5+CIG4cPB88SS5iU8mRLhE8v9kpQX7JwnSNLHqCs7oQNSXcnWcsQJ4s0tcHgGcYLD5dODKoiOOqY4FXTsqYSOJflih0ajA0sq3eFiAVJPKCiHqALWOXrjBtekD7RKh+zwIKYKrKfMOAg7guogu8s0pnS481WBxbVdwSim9JtssW3ai8I5Fe12rVBV2BYhI1Rqv8PgRsu1VoU7hBlrpxDRMLEubMf1OKw9TERhe20zcV1GqwAman/tdA6pqGaJlSWnIxXXVrJShWSkYhtwPh9JcT1i79RsfKvSR1MX1WUE3i5hSNAa+3HBb5M+ErxXSdIYe8dGwXStpwundI2eN2w+vWebbipWKeU0o4xtR5+RuPU7RZP8cMLE0R3HCYooIyTdnDWlEjyiQmeOGYUN86hTh3mKW449zZANiKkrBsRm8Efp9FWjdAst5tBhfR2lBfN4ppsXfWE8c8FrkFVtz5Loa4OsL9xt5PcPy3B0daPh6IyMjIyMjIyMjIyM/wD/AKrlLaHofErWAAAAAElFTkSuQmCC"
                                      alt="Avatar"
                                    />
                                  )}
                                  <div class="ml-4">
                                    <p class="mb-0.5 font-medium">
                                      {elem.firstname} {elem.lastname}
                                    </p>
                                    <p class="mb-0.5 text-gray-500">
                                      {elem.email}
                                    </p>
                                  </div>
                                </div>
                              </th>
                              <td class="text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                                <div class="flex flex-col">
                                  <p class="mb-0.5">
                                    {elem.country}
                                  </p>
                                </div>
                              </td>
                              <td class="align-middle text-sm font-normal px-6 py-4 whitespace-nowrap text-left">
                                <span class="text-xs py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-green-200 text-green-600 rounded-full">
                                  {elem.age}
                                </span>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <FooterDown/>
    </>
  );
};

export default Home;
