export const Header = () => {
  return (
    <div>
      <div className="max-lg:collapse bg-base-200 lg:mb-48 shadow-sm w-full rounded-md">

        <input
          id="navbar-1-toggle"
          className="peer hidden"
          type="checkbox"
        />

        <label
          htmlFor="navbar-1-toggle"
          className="fixed inset-0 hidden max-lg:peer-checked:block"
        ></label>

        <div className="collapse-title navbar px-2 sm:px-4 lg:px-6">

          <div className="navbar-start">
            <h1 className="text-blue-800 font-bold text-lg sm:text-xl">
              Aruna
            </h1>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li><button>DASHBOARD</button></li>
              <li><button>STORIES</button></li>
              <li><button>JOB BOARD</button></li>
              <li><button>WORK SHOPS</button></li>
              <li><button>COMMUNITY</button></li>
            </ul>
          </div>
          <div className="navbar-end gap-1 sm:gap-2">


            <button className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <div className="flex-none">
              <ul className="menu menu-horizontal px-0 sm:px-1">

                <li>
                  <a className="text-xs sm:text-sm md:text-base">
                    Login
                  </a>
                </li>

                <li>
                  <a className="bg-[#020079] text-white hover:bg-[#020079] text-xs sm:text-sm md:text-base">
                    Sign Up
                  </a>
                </li>

              </ul>
            </div>

            <div className="flex gap-1 sm:gap-2">

              <div className="dropdown dropdown-end">

                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-8 sm:w-9 md:w-10 rounded-full">

                    <img
                      alt="Profile Picture"
                      src="/Profile_pic.jpg"
                    />

                  </div>
                </div>
                <ul
                  tabIndex={-1}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
                >

                  <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">
                        Edit Profile
                      </span>
                    </a>
                  </li>

                  <li>
                    <a>Settings</a>
                  </li>

                  <li>
                    <a>Logout</a>
                  </li>

                </ul>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};