"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import type { ProfileResponse } from "@/types/api"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { clearAuth } from "@/lib/auth"

export default function ProfilePage() {
  const [data, setData] = useState<ProfileResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get("/auth/profile/")
      .then((res) => setData(res.data))
      .catch(() => setError("Falha ao carregar perfil."))
  }, [])

  const logout = async () => {
    try {
      await fetch("/api/auth/session", { method: "DELETE" })
    } catch {}
    clearAuth()
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-end items-center">
          <Button onClick={logout} className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded">
            Logout
          </Button>
        </div>
      </header>

      <main className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-8 bg-white">
          {!data && !error ? (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600 mb-2">Profile picture</div>
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Your Name</div>
                  <Skeleton className="h-10 w-full rounded bg-gray-100" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-2">Your E-mail</div>
                  <Skeleton className="h-10 w-full rounded bg-gray-100" />
                </div>
              </div>
            </div>
          ) : error ? (
            <p className="text-sm text-red-600 text-center">{error}</p>
          ) : (
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600">Profile picture</div>
                <Avatar className="h-16 w-16 mx-auto">
                  {data!.avatar?.image_low_url ? (
                    <AvatarImage src={data!.avatar.image_low_url || "/placeholder.svg"} alt="Avatar" />
                  ) : (
                    <AvatarFallback className="text-lg">{(data!.name?.[0] || "U").toUpperCase()}</AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Your Name</label>
                  <div className="bg-gray-100 p-3 rounded text-gray-800">
                    {data!.name} {data!.last_name}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Your E-mail</label>
                  <div className="bg-gray-100 p-3 rounded text-gray-800">{data!.email}</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
