import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginDialogProps } from "@/app/Types";
import { Eye, EyeOff } from "lucide-react";

const LoginDialog: React.FC<LoginDialogProps> = ({
  isLoginDialogOpen,
  username,
  setUsername,
  password,
  setPassword,
  loginError,
  handleLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (loginError.username) {
      loginError.username = "";
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (loginError.password) {
      loginError.password = "";
    }
  };

  return (
    <Dialog open={isLoginDialogOpen}>
      <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-700 border">
        <span className="inline-block bg-zinc-900 h-4 w-5 absolute z-10 right-4 top-4"></span>
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-white flex items-center justify-center mb-6">
            Login
          </DialogTitle>
          <DialogDescription className="text-blue-500">Please enter your username and password</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              className={loginError.username ? "border-red-500" : ""}
            />
            {loginError.username && (
              <p className="text-red-500">{loginError.username}</p>
            )}
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={loginError.password ? "border-red-500" : ""}
            />
            <Button
              size="icon"
              className="absolute inset-y-0 right-0 flex items-center !bg-transparent border-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </Button>
            {loginError.password && (
              <p className="text-red-500">{loginError.password}</p>
            )}
          </div>
          <Button
            onClick={handleLogin}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-400 text-white"
          >
            Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
